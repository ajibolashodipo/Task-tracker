const Task = require("../models/Tasks");
const User = require("../models/Users");
//middleware
function isLoggedIn(req, res, next) {
  //next is the next thing that needs to be called.
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = isLoggedIn;
