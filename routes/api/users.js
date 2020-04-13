// const express = require("express");
// const router = express.Router();

// //@route    GET api/users
// //@desc     Test route
// //@access   Public (no need token)
// router.get("/", (req, res) => res.send("user route"));

// module.exports = router;

const express = require("express");
const router = express.Router();

//@route    POST api/users
//@desc     Register user
//@access   Public (no need token)
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("user route");
});

module.exports = router;
