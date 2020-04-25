const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

//@route    GET api/profile/me
//@desc     Get current users profile
//@access   private (need token)
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Post api/profile
//@desc     Create or update user profile
//@access   private (need token)
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company; //like if (company) profileFields.company = req.body.company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim()); //turn string to array with dlimitter , trim()- no metter if its space or even ten spaces
    }
    // //in postman raw
    // {
    //     "status": "Developer",
    //     "skills":"HTML, CSS, REACT, Nodejs"
    // }

    // console.log(skills); //this is string skills
    // console.log(profileFields.skills); //this is array skills with no netter if it comma or comma space .. comma = ,

    //Build social object
    profileFields.social = {}; //if not do this it will say something of undefind
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create - if not have profile so we create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Get api/profile
//@desc     Get all  profiles
//@access   Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Get api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    //if we type id that not match
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route    Delete api/profile
//@desc     Delete profile, user & posts
//@access   Private
router.delete("/", auth, async (req, res) => {
  try {
    //remove users posts
    await Post.deleteMany({ user: req.user.id });
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Put api/profile/experience
//@desc     Add profile experience
//@access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Delete api/profile/experience/:exp_id
//@desc     DElete experience from profile
//@access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Put api/profile/education
//@desc     Add profile education
//@access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Delete api/profile/eduication/:edu_id
//@desc     DElete eduication from profile
//@access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/profile/github/:username
//@desc     Get user repos from Github
//@access   Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.errors(error);

      if (response.statusCode !== 200) {
        //if faild
        return res.status(404).json({ msg: "No Github profile found" }); //not found
      }
      res.json(JSON.parse(body)); //if no parse it will be regular string
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//http://localhost:5000/api/profile/me

//http://localhost:5000/api/profile/user/5e976f1da365261708240d9e   5e976f1da365261708240d9e = id

//http://localhost:5000/api/profile
//in postman raw
// {
// 	"company": "Dori-Media",
// 	"status": "Developer",
// 	"skills": "HTML, CSS, REACT, Nodejs, JS",
// 	"website": "https://dori-new.herokuapp.com/"
// 	"location": "Yavne, IL",
// 	"bio": "i am a developer for dori-media",
// 	"githubusername": "https://github.com/doribasson/",
// 	"twitter": "none",
// 	"facebook": "none",
// 	"youtube": "none"
// }

//Add Experience to profile
//http://localhost:5000/api/profile/experience  in psotman
//for dori-bassson
// x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
//Content-Type - application/json

//Put - Add experience to Profile
// x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
//Content-Type - application/json
//body raw
//{
// 	"title": "Developer",
// 	"company": "Dori Media",
// 	"location": "Yavne, IL",
// 	"from": "4-17-2020",
// 	"current": true,
// 	"description": "Create experience"
// }

//Delete profile & user
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5OWExMDNhNjZkODk4MWI4ZGQ0ZDIwIn0sImlhdCI6MTU4NzEyNjUzMiwiZXhwIjoxNTg3NDg2NTMyfQ.CnfeJlavAqugACqsz4jP0A_IgSUSs71mhfF92nacLN4

//Get profile by user ID
//http://localhost:5000/api/profile/user/{$id}
//http://localhost:5000/api/profile/user/5e976f1da365261708240d9e - dori
//http://localhost:5000/api/profile/user/5e98b90d0e8138366c39603c - ordit

//Get all profiles
//http://localhost:5000/api/profile

//Get logged in users profile
//http://localhost:5000/api/profile/me
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ

//Create and update profile
//http://localhost:5000/api/profile
//Content-Type - application/json
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
// //body - {
// 	"company": "Dori-Media",
// 	"status": "Developer",
// 	"skills": "HTML, CSS, REACT, Nodejs, JS",
// 	"website": "https://dori-new.herokuapp.com/",
// 	"location": "Yavne, IL",
// 	"bio": "i am a developer for dori-media",
// 	"githubusername": "https://github.com/doribasson/",
// 	"twitter": "none",
// 	"facebook": "none",
// 	"youtube": "noneeee"
// }

//Delete from Array Experience from Profile
// http://localhost:5000/api/profile/experience/${_id}
// http://localhost:5000/api/profile/experience/5e99d05e4657fc0e8c164273
// x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4NzEzODkxNCwiZXhwIjoxNTg3NDk4OTE0fQ.7CAo755MlcBequcXT2FVEWiGgG6ttTh7mjv_cE0a4GE

//Put - Add eduction to Profile
//http://localhost:5000/api/profile/education
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
//Content-Type - application/json
//body
// {
// 	"school": "Ginsburg haoren",
// 	"degree": "cs Degree",
// 	"fieldofstudy": "Computer Science",
// 	"from": "4-17-2017",
// 	"to": "3-31-2019",
// 	"description": "Graduated B.sc "
// }

//Delete from Array Education from Profile
//http://localhost:5000/api/profile/education/${id}
//http://localhost:5000/api/profile/education/5e9b558eaa6e72791011c197
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4NzEzODkxNCwiZXhwIjoxNTg3NDk4OTE0fQ.7CAo755MlcBequcXT2FVEWiGgG6ttTh7mjv_cE0a4GE
