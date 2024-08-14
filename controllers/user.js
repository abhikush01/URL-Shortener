const user = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser, getUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await user.create({
    name,
    email,
    password,
  });
  const u = await user.findOne({ email, password });
  if (u) {
    createToken(res, u);
    res.locals.cookies = res.cookies;
    return res.redirect("/home");
  }
  // If user creation or lookup fails, redirect to signup with an error
  return res.redirect("/signup?error=Signup failed");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const u = await user.findOne({ email, password });
  if (!u) return res.render("login", { error: "Ivalid Username Or password" });
  // const sessionId = uuidv4();
  // setUser(sessionId, u);
  createToken(res, u);
  res.locals.cookies = res.cookies;
  return res.redirect("/home");
}

const createToken = (res, user) => {
  try {
    const token = setUser(user);
    res.cookie("token", token);
  } catch (error) {
    console.error("Token creation error:", error);
  }
};

module.exports = { handleUserSignup, handleUserLogin };
