// const express = require("express");
// const router = express.Router();

// //@route    GET api/users
// //@desc     Test route
// //@access   Public (no need token)
// router.get("/", (req, res) => res.send("user route"));

// module.exports = router;

const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@route    POST api/users
//@desc     Register user
//@access   Public (no need token)
router.post(
  "/",
  [
    check("name", "Name is require")
      .not()
      .isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if there are error
      return res.status(400).json({ errors: errors.array() }); //400= bad request , 200= good ..we get in json
    }

    const { name, email, password } = req.body;
    //User.findOne().then()... old promise but we going to use async and wait

    try {
      // See if the user exists by email
      let user = await User.findOne({ email: email });
      if (user) {
        //if email exists
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200", //size
        r: "pg", //riding
        d: "mm" //default img like user icon
      });

      user = new User({
        name, //name,... name: name .. name: req.body.name all the same
        email,
        avatar,
        password
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //save to database... user.save() its promise user.save().then().. but we use in async and await

      //return json token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    // const users = await User.find().select("-password"); //show without password field
    const users = await User.find(); //show with password field
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//http://localhost:5000/api/users get in postman
