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
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const u = await user.findOne({ email, password });
  if (!u) return res.render("login", { error: "Ivalid Username Or password" });
  // const sessionId = uuidv4();
  // setUser(sessionId, u);
  const token = setUser(u);
  res.cookie("token", token);
  return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
