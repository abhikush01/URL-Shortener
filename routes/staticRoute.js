const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");
const router = express.Router();

router.get("/", restrictTo(["NORMAL"]), async (req, res) => {
  const url = await URL.find({ createdBy: req.user._id });
  return res.render("home", { urls: url });
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.get("/login", async (req, res) => {
  return res.render("login");
});

module.exports = router;
