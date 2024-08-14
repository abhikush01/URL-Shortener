require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const URL = require("./models/url");
const connect = require("./config");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const staticRoute = require("./routes/staticRoute");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const publicRoutes = require("./routes/publicRoutes");

connect(process.env.DB_URL).then(() => console.log("Db Connected"));

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory before any middleware
app.use(express.static(path.join(__dirname, "public")));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});

// Routes
app.use("/", publicRoutes);
app.use("/user", userRoute);
app.use("/url", checkForAuthentication, urlRoute);
app.use("/home", checkForAuthentication, staticRoute);

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
