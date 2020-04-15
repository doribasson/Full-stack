const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //for token
const User = require("../../models/User");

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

module.exports = router;

//http://localhost:5000/api/auth in postman get..Header KEY:x-auth-token  , VALUE:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NmZmMGExZGU0NjQyYjE4OTJlODNhIn0sImlhdCI6MTU4Njk1Mzk5NCwiZXhwIjoxNTg3MzEzOTk0fQ.C5I47vVd0Fw_vIBnpE0YTXEgzhct6Yk8CFse1kyuIWs
