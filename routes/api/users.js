const express = require("express");
const router = express.Router();

//@route    GET api/users
//@desc     Test route
//@access   Public (no need token)
router.get("/", (req, res) => res.send("user route"));

module.exports = router;
