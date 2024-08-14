const express = require("express");
const URL = require("../models/url");
const router = express.Router();

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.get("/login", async (req, res) => {
  return res.render("login");
});

router.get("/", async (req, res) => {
  res.clearCookie("token");
  return res.render("landing");
});

module.exports = router;
