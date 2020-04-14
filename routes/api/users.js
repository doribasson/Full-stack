// const express = require("express");
// const router = express.Router();

// //@route    GET api/users
// //@desc     Test route
// //@access   Public (no need token)
// router.get("/", (req, res) => res.send("user route"));

// module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if there are error
      return res.status(400).json({ errors: errors.array() }); //400= bad request , 200= good ..we get in json
    }
    res.send("user route");
  }
);

module.exports = router;
