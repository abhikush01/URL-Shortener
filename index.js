const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const URL = require("./models/url");
const connect = require("./config");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const staticRoute = require("./routes/staticRoute");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

connect("mongodb://127.0.0.1:27017/Short-url").then(() =>
  console.log("Db Connected")
);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
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
});

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
