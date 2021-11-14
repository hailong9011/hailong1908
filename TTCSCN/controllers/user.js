const User = require("../models/user.model");
const Category = require("../models/category.model");
const PaymentBook = require("../models/transactionhistory.model");
const Comment = require("../models/comment.model");
const Book = require("../models/book.model");
const Turnover = require("../models/turnover.model");
const Notification = require("../models/notification.model");
const NotificationAdmin = require("../models/notificationadmin.model");
const bcrypt = require("bcrypt");
const { unsubscribe } = require("../routes/homepage");

exports.getInfo = async (req, res) => {
  const category = await Category.find({});
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const bookPay = await PaymentBook.find({ userId: userId }).countDocuments();
  const noti = await Notification.find({ userId: userId })
    .sort({ date: -1 })
    .limit(10);
  const notiAdmin = await NotificationAdmin.find().sort({ date: -1 });
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  res.render("info.ejs", {
    category: category,
    isAdmin: isAdmin,
    numberNotiAdmin: numberNotiAdmin,
    numberNoti: numberNoti,
    user: user,
    noti: noti,
    notiAdmin: notiAdmin,
    userId: userId,
    bookPay: bookPay,
  });
};

exports.updateNoti = async (req, res) => {
  const id = req.params.id;
  const noti = await Notification.findOne({ _id: id });
  const url = "/book/" + noti.book;
  await Notification.updateOne({ _id: id }, { $set: { read: true } });
  res.redirect(url);
};

exports.updateNotiAdmin = async (req, res) => {
  await NotificationAdmin.updateMany({ $set: { read: true } });
  res.redirect("/info");
};

exports.postHotComment = async (req, res) => {
  const userId = req.session.userId;
  const isAdmin = req.session.isAdmin;
  const commentContent = req.params.comment;
  const date = req.params.time;
  const user = await User.findOne({ _id: userId });
  const comment = new Comment({
    book: "homepage",
    comment: commentContent,
    userId: userId,
    username: user.username,
    date: date,
    isAdmin: isAdmin,
    avatar: user.avatar,
    hotComment: true,
  });
  await comment.save();
  res.redirect("/");
};

exports.updateUsername = async (req, res) => {
  const userId = req.session.userId;
  const username = req.params.username;
  const user = await User.findOne({ _id: userId });
  user.username = username;
  user.avatar = "https://ui-avatars.com/api/?name=" + username;
  await Comment.updateMany(
    { userId: userId },
    { $set: { username: username } }
  );
  await Comment.updateMany(
    { userId: userId },
    { $set: { avatar: "https://ui-avatars.com/api/?name=" + username } }
  );
  await user.save();
  res.redirect("/info");
};

exports.getUpdatePassword = async (req, res) => {
  const category = await Category.find({});
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  res.render("password.ejs", {
    message: req.flash("message-pass"),
    category: category,
    isAdmin: isAdmin,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.updatePassword = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  bcrypt.compare(
    req.body.curpassword,
    user.password,
    async function (err, result) {
      if (result == false) {
        req.flash("message-pass", "Mật khẩu hiện tại không đúng");
        res.redirect("/password");
      } else {
        if (req.body.curpassword == req.body.newpassword) {
          req.flash(
            "message-pass",
            "Mật khẩu mới không được giống mật khẩu hiện tại"
          );
          res.redirect("/password");
        } else {
          if (req.body.newpassword == req.body.repassword) {
            salt = await bcrypt.genSalt();
            newpassword = await bcrypt.hash(req.body.newpassword, salt);
            user.password = newpassword;
            await user.save();
            req.flash("message-pass", "Đổi mật khẩu thành công");
            res.redirect("/password");
          } else {
            req.flash("message-pass", "Mật khẩu không khớp");
            res.redirect("/password");
          }
        }
      }
    }
  );
};

exports.getRecharge = async (req, res) => {
  const category = await Category.find({});
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  const paymentbook = await PaymentBook.find({ userId: userId }).sort({
    time: -1,
  });
  const book_title = "null";
  const cash = 0;
  res.render("recharge.ejs", {
    message: req.flash("message-recharge"),
    category: category,
    isAdmin: isAdmin,
    user: user,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    paymentbook: paymentbook,
    userId: userId,
    book_title: book_title,
    cash: cash,
  });
};

exports.Recharge = async (req, res) => {
  const userId = req.session.userId;
  const time = req.params.time;
  const action = "Nạp tiền: " + req.params.cash;
  const user = await User.findOne({ _id: userId });
  if (req.params.book == "null" && parseInt(req.params.money) == 0) {
    url = "/recharge";
  } else {
    url = "/recharge/" + req.params.book + "/" + req.params.money;
  }
  user.totalCash = user.totalCash + parseInt(req.params.cash);
  user.cashRecharged = user.cashRecharged + parseInt(req.params.cash);
  const paymentBook = new PaymentBook({
    time: time,
    userId: userId,
    action: action,
    surplus: user.totalCash,
  });
  await paymentBook.save();
  await user.save();
  res.redirect(url);
  req.flash("message-recharge", "Nạp thành công !");
};

exports.getPay = async (req, res) => {
  const category = await Category.find({});
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const book_title = req.params.title;
  const cash = req.params.cash;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  const paymentbook = await PaymentBook.find({ userId: userId }).sort({
    time: -1,
  });
  res.render("recharge.ejs", {
    message: req.flash("message-recharge"),
    category: category,
    isAdmin: isAdmin,
    user: user,
    numberNotiAdmin: numberNotiAdmin,
    numberNoti: numberNoti,
    paymentbook: paymentbook,
    userId: userId,
    book_title: book_title,
    cash: cash,
  });
};

exports.PayForBook = async (req, res) => {
  const userId = req.session.userId;
  const cash = req.params.cash;
  const time = req.params.time;
  const bookTitle = req.params.title;
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  const url = "/book/" + req.params.title;
  const action = "Thanh toán" + bookTitle + ": " + cash;
  const user = await User.findOne({ _id: userId });
  const book = await Book.findOne({ title: bookTitle });
  const turnover = await Turnover.findOne({
    $and: [{ year: year }, { month: month }],
  });
  if (turnover) {
    turnover.turnover = turnover.turnover + parseInt(cash);
    await turnover.save();
  } else {
    const turnoverNew = new Turnover({
      turnover: turnover + parseInt(cash),
      year: year,
      month: month,
    });
    await turnoverNew.save();
  }
  book.numberUserPayFor = book.numberUserPayFor + 1;
  user.totalCash = user.totalCash - parseInt(cash);
  user.cashPayed = user.cashPayed + parseInt(cash);
  const paymentbook = new PaymentBook({
    time: time,
    book: bookTitle,
    userId: userId,
    action: action,
    surplus: user.totalCash,
  });
  await book.save();
  await paymentbook.save();
  await user.save();
  res.redirect(url);
};

exports.deleteCmt = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id });
  await NotificationAdmin.updateMany(
    { commentId: req.params.id },
    { $set: { deleted: true } }
  );
  await comment.remove();
  res.redirect("/info");
};

exports.postNotiHome = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.session.userId;
  const comment = await Comment.findOne({ _id: commentId });
  const userReport = await User.findOne({ _id: userId });
  const notiAdmin = new NotificationAdmin({
    book: "Bình luận nổi bật",
    notification: userReport.username + " đã báo cáo bình luận vi phạm !",
    date: req.params.time,
    read: false,
    commentId: commentId,
    avatar: comment.avatar,
    username: comment.username,
    dateComment: comment.date,
    comment: comment.comment,
  });
  await notiAdmin.save();
  res.redirect("/");
};

exports.deleteCommentHome = async (req, res) => {
  const commentId = req.params.id;
  await Comment.deleteOne({ _id: commentId });
  res.redirect("/");
};
