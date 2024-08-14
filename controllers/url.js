const { v4: uuidv4 } = require("uuid");
const URL = require("../models/url");
const { isValidUrl, isReachableUrl } = require("../service/url");

const symbol = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

async function generateUniqueShortID() {
  const uuid = uuidv4();
  let numericId = 1;
  for (let i = 0; i < uuid.length; i++) {
    let ch = uuid[i];
    let value = ch.charCodeAt(0);
    if (value >= 48 && value <= 57) numericId += value - 48;
    if (value >= 65 && value <= 90) numericId += value - 65 + 11;
    if (value >= 97 && value <= 112) numericId += value - 97 + 73;
  }

  const temp = Math.ceil(Math.random() * 100) * 23 * 7;
  numericId = numericId * temp;

  let hashValue = "";
  let dummyId = numericId;

  while (dummyId != 0) {
    const rem = dummyId % 62;
    hashValue += symbol[rem];
    dummyId = Math.floor(dummyId / 62);
  }

  return hashValue;
}

async function handleGenerateShortURL(req, res) {
  const body = req.body;
  const url = body.url.trim();

  if (!url) {
    const url = await URL.find({ createdBy: req.user._id });
    return res
      .status(400)
      .render("home", { error: "URL is required", urls: url });
  }

  if (!isValidUrl(url)) {
    const url = await URL.find({ createdBy: req.user._id });
    return res
      .status(400)
      .render("home", { error: "Not a valid URL", urls: url });
  }
  if (!(await isReachableUrl(url))) {
    const url = await URL.find({ createdBy: req.user._id });
    return res
      .status(400)
      .render("home", { error: "URL is Not Reachable", urls: url });
  }

  const result = await URL.findOne({ redirectURL: url });

  if (result) {
    const urls = await URL.find({ createdBy: req.user._id });
    return res.status(300).render("home", {
      error: "Short Id alredy generated for this URL",
      urls,
    });
  }

  const shortID = await generateUniqueShortID();

  try {
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });
    const url = await URL.find({ createdBy: req.user._id });
    return res.status(200).render("home", { id: shortID, urls: url });
  } catch (error) {
    console.error("Error creating URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleUrlToLong(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
}

module.exports = {
  handleGenerateShortURL,
  handleGetAnalytics,
  handleUrlToLong,
};
