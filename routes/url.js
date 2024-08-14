const express = require("express");
const {
  handleGenerateShortURL,
  handleGetAnalytics,
  handleUrlToLong,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateShortURL);

router.get("/:shortId", handleUrlToLong);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
