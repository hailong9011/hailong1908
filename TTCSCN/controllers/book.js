const User = require("../models/user.model");
const Book = require("../models/book.model");
const Chapter = require("../models/chapter.model");
const Category = require("../models/category.model");
const Author = require("../models/author.model");
const Comment = require("../models/comment.model");
const Follow = require("../models/follow.model");
const PaymentBook = require("../models/transactionhistory.model");
const Notification = require("../models/notification.model");
const NotificationAdmin = require("../models/notificationadmin.model");
const { data } = require("jquery");

exports.getBookInfo = async (req, res) => {
  const userId = req.session.userId;
  const pageSize = 15;
  const isAdmin = req.session.isAdmin;
  var name = RegExp(req.params.title, "i");
  var page = req.query.page;
  const user = await User.findOne({ _id: userId });
  const book = await Book.findOne({ title: req.params.title });
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  const follow = await Follow.findOne({
    $and: [{ bookFollowed: req.params.title }, { userId: userId }],
  });
  const newChapter = await Chapter.find({ book_title: req.params.title })
    .sort({ number: -1 })
    .limit(3);
  const chapterFree = await Chapter.find({ book_title: req.params.title })
    .sort({ number: 1 })
    .limit(3);
  const comment = await Comment.find({
    $and: [{ book: req.params.title }, { hotComment: false }],
  }).sort({
    date: -1,
  });
  const total = await Chapter.find({
    book_title: req.params.title,
  }).countDocuments();
  const pageNumber = Math.ceil(total / pageSize);
  if (page === undefined) {
    page = "1";
  }
  page = parseInt(page);
  if (page == 1) {
    var chapter = await Chapter.find({ book_title: req.params.title })
      .sort({ number: 1 })
      .skip(3)
      .limit(12);
  } else {
    var count = (page - 1) * pageSize;
    var chapter = await Chapter.find({ book_title: req.params.title })
      .sort({ number: 1 })
      .skip(count)
      .limit(pageSize);
  }
  var paymentbook = await PaymentBook.findOne({
    $and: [{ userId: userId }, { action: name }],
  });
  console.log(paymentbook);
  res.render("book/book-detail", {
    book: book,
    newChapter: newChapter,
    comment: comment,
    chapter: chapter,
    chapterFree: chapterFree,
    category: category,
    isAdmin: isAdmin,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
    paymentbook: paymentbook,
    pageNumber: pageNumber,
    page: page,
    follow: follow,
  });
};

exports.postFollow = async (req, res) => {
  const result = req.params.result;
  const userId = req.session.userId;
  const follow = parseInt(req.params.follow);
  const book = await Book.findOne({ title: req.params.title });
  const url = "/book/" + req.params.title;
  if (result == "true") {
    book.follow = follow + 1;
    await book.save();
    const bookFollow = new Follow({
      userId: userId,
      bookFollowed: req.params.title,
    });
    await bookFollow.save();
    res.redirect(url);
  } else {
    book.follow = follow - 1;
    await book.save();
    const bookFollow = await Follow.findOne({
      $and: [{ userId: userId }, { bookFollowed: req.params.title }],
    });
    await bookFollow.remove();
    res.redirect(url);
  }
};

exports.postComment = async (req, res) => {
  const title = req.params.title;
  const userId = req.session.userId;
  const isAdmin = req.session.isAdmin;
  const commentContent = req.params.comment;
  const date = req.params.time;
  const user = await User.findOne({ _id: userId });
  const url = "/book/" + req.params.title;
  const comment = new Comment({
    book: title,
    comment: commentContent,
    userId: userId,
    username: user.username,
    date: date,
    isAdmin: isAdmin,
    avatar: user.avatar,
    hotComment: false,
  });
  await comment.save();
  res.redirect(url);
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const url = "/book/" + req.params.title;
  await Comment.deleteOne({ _id: commentId });
  res.redirect(url);
};

exports.postNoti = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.session.userId;
  const comment = await Comment.findOne({ _id: commentId });
  const url = "/book/" + req.params.title;
  const userReport = await User.findOne({ _id: userId });
  const notiAdmin = new NotificationAdmin({
    book: req.params.title,
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
  res.redirect(url);
};

exports.getChapter = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.findOne({ title: req.params.titleBook });
  var chap = req.query.chapter;
  if (chap === undefined) {
    chap = "1";
  }
  chap = parseInt(chap);
  const chapter = await Chapter.findOne({
    $and: [{ book_title: req.params.titleBook }, { number: chap }],
  });
  const chapterPagination = await Chapter.find({
    book_title: req.params.titleBook,
  }).sort({ number: 1 });
  const countChapter = await Chapter.find({
    book_title: req.params.titleBook,
  }).countDocuments();
  const category = await Category.find({});
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  res.render("book/chapter", {
    book: book,
    chapter: chapter,
    category: category,
    countChapter: countChapter,
    isAdmin: isAdmin,
    chapterPagination: chapterPagination,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.getSearchPage = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.find({});
  const author = await Author.find({});
  const chapter = await Chapter.findOne({ title: req.params.title });
  const category = await Category.find({});
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  res.render("book/search.ejs", {
    book: book,
    chapter: chapter,
    author: author,
    category: category,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    isAdmin: isAdmin,
    user: user,
    userId: userId,
  });
};

exports.getSearchBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const author = await Author.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  var name = RegExp(req.params.search, "i");
  var book = await Book.find({
    $or: [{ title: name }, { author: name }, { category: name }],
  });
  res.render("book/search.ejs", {
    isAdmin: isAdmin,
    book: book,
    category: category,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    author: author,
    user: user,
    userId: userId,
  });
};

exports.getFilterSearch = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const author = await Author.find({});
  var authorName = req.body.searchAuth;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  var status = req.body.searchStt;
  var categoryName = RegExp(req.body.searchCate, "i");
  if (status != "null") {
    var book = await Book.find({ status: status });
    if (authorName != "null") {
      var book = await Book.find({
        $and: [{ author: authorName }, { status: status }],
      });
      if (categoryName != "/null/i") {
        var book = await Book.find({
          $and: [
            { category: categoryName },
            { status: status },
            { category: categoryName },
          ],
        });
      }
    }
    if (categoryName != "/null/i") {
      var book = await Book.find({
        $and: [{ category: categoryName }, { status: status }],
      });
      if (authorName != "null") {
        var book = await Book.find({
          $and: [
            { author: authorName },
            { status: status },
            { category: categoryName },
          ],
        });
      }
    }
  }
  if (categoryName != "/null/i" && authorName != "null") {
    var book = await Book.find({
      $and: [{ category: categoryName }, { authorName: status }],
    });
  }
  if (categoryName == "/null/i" && authorName == "null" && status == "null") {
    var book = await Book.find({});
  }
  res.render("book/search.ejs", {
    isAdmin: isAdmin,
    book: book,
    category: category,
    numberNoti: numberNoti,
    numberNotiAdmin: numberNotiAdmin,
    author: author,
    user: user,
    userId: userId,
  });
};

exports.getFbook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const chapter = await Chapter.find({});
  const category = await Category.find({});
  const follow = await Follow.find({ userId: userId });
  const book = await Book.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const numberNoti = await Notification.find({
    $and: [{ userId: userId }, { read: false }],
  }).countDocuments();
  res.render("book/followed-book.ejs", {
    isAdmin: isAdmin,
    chapter: chapter,
    category: category,
    user: user,
    numberNotiAdmin: numberNotiAdmin,
    numberNoti: numberNoti,
    userId: userId,
    follow: follow,
    book: book,
  });
};
