// const app = require("express")();
//app.post("/", auth, (req, res, next) => {

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
router.post("/", auth, (req, res, next) => {
  res.status(200).send("flight rescheduled");
});
module.exports = router;
