const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

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
    //todo - remove users posts

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
