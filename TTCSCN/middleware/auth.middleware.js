const User = require("../models/user.model");

module.exports.requireAuth = function (req, res, next) {
  if (!req.cookies.userId) {
    res.redirect("/login");
    return;
  }
  next();
};

module.exports.requireAuthAdmin = function (req, res, next) {
  if (!req.cookies.userId) {
    res.redirect("/login");
    return;
  }

  var isAdmin = req.cookies.isAdmin;
  if (isAdmin == "false") {
    res.redirect("/");
    return;
  }

  next();
};
