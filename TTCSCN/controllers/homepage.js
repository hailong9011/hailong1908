const User = require("../models/user.model");
const Book = require("../models/book.model");
const Category = require("../models/category.model");
const Comment = require("../models/comment.model");
const Notification = require("../models/notification.model");
const NotificationAdmin = require("../models/notificationadmin.model");
const bcrypt = require("bcrypt");

exports.getHomepage = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.find({}).sort({ date: -1 }).limit(8);
  const bookFollowed = await Book.find({}).sort({ follow: -1 }).limit(6);
  const bookPayed = await Book.find({}).sort({ numberUserPayFor: -1 }).limit(6);
  const category = await Category.find({});
  const isAdmin = req.session.isAdmin;
  const bookFull = await Book.find({ status: true }).limit(12);
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const comment = await Comment.find({ hotComment: true }).sort({
    date: -1,
  });
  res.render("home", {
    book: book,
    numberNoti: numberNoti,
    category: category,
    bookPayed: bookPayed,
    bookFollowed: bookFollowed,
    isAdmin: isAdmin,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
    bookFull: bookFull,
    comment: comment,
  });
};

exports.getFormLogin = async (req, res) => {
  const book = await Book.find({});
  const category = await Category.find({});
  res.render("login", {
    message: req.flash("message"),
    book: book,
    category: category,
  });
};

exports.postLogin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (user) {
      if (result == true) {
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.cookie("userId", user._id);
        res.cookie("isAdmin", user.isAdmin);
        res.redirect("/");
      } else {
        req.flash("message", "Sai mật khẩu");
        res.cookie("userId", user._id);
        res.cookie("isAdmin", user.isAdmin);
        res.redirect("login");
      }
    } else {
      req.flash("message", "Tài khoản không tồn tại");
      res.cookie("userId", user._id);
      res.cookie("isAdmin", user.isAdmin);
      res.redirect("login");
    }
  });
};

exports.getLogout = (req, res) => {
  req.session.destroy();
  res.clearCookie("userId");
  res.clearCookie("isAdmin");
  res.redirect("/");
};

exports.getFormRegistry = async (req, res) => {
  const category = await Category.find({});
  res.render("registry.ejs", {
    message: req.flash("message-user"),
    category: category,
  });
};

exports.Registry = async (req, res) => {
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(req.body.password, salt);
  const validate = await User.findOne({ email: req.body.email });
  if (validate != null) {
    req.flash("message-user", "Email đã tồn tại");
    res.redirect("/registry");
  } else if (req.body.password != req.body.repassword) {
    req.flash("message-user", "Mật khẩu không khớp");
    res.redirect("/registry");
  } else {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: password,
      avatar: "https://ui-avatars.com/api/?name=" + req.body.username,
    });
    await user.save();
    res.redirect("/login");
  }
};
