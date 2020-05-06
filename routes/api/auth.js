const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //for token
const User = require("../../models/User");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

//@route    GET api/auth
//@desc     Test route
//@access   Protected (need token)
// router.get("/", (req, res) => res.send("auth route")); //not protected
// router.get("/", auth, (req, res) => res.send("auth route")); //with auth its now protected
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/auth
//@desc     Authentticate user token //login
//@access   Public (no need token)
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //400= bad request , 200= good ..we get in json
    }

    const { email, password, role } = req.body;
    //User.findOne().then()... old promise but we going to use async and wait

    try {
      // See if the user exists by email
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid Credentials" }] });
      }

      //return json token
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          console.log(user.role);
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

module.exports = router;

//http://localhost:5000/api/auth in postman get..Header KEY:x-auth-token  , VALUE:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NmZmMGExZGU0NjQyYjE4OTJlODNhIn0sImlhdCI6MTU4Njk1Mzk5NCwiZXhwIjoxNTg3MzEzOTk0fQ.C5I47vVd0Fw_vIBnpE0YTXEgzhct6Yk8CFse1kyuIWs
