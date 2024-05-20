const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateShortURL(req, res) {
  const shortID = shortid.generate();
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.status(200).render("home", { id: shortID });
  } catch (error) {
    // Handle any errors that occur during URL creation
    console.error("Error creating URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortid });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = { handleGenerateShortURL, handleGetAnalytics };
