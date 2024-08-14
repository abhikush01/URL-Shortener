const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");
const router = express.Router();

router.get("/", restrictTo(["NORMAL"]), async (req, res) => {
  const url = await URL.find({ createdBy: req.user._id });
  return res.render("home", { urls: url });
});

module.exports = router;
