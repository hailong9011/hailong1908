const User = require("../models/user.model");
const Book = require("../models/book.model");
const Chapter = require("../models/chapter.model");
const Category = require("../models/category.model");
const Author = require("../models/author.model");
const Turnover = require("../models/turnover.model");
const Follow = require("../models/follow.model");
const Notification = require("../models/notification.model");
const NotificationAdmin = require("../models/notificationadmin.model");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");

exports.getStatistical = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const TopUser = await User.find({}).sort({ cashPayed: -1 }).limit(5);
  const TopPayBook = await Book.find({})
    .sort({ numberUserPayFor: -1 })
    .limit(5);
  const TopFollowBook = await Book.find({}).sort({ follow: -1 }).limit(5);
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const userNoPay = await User.find({ cashPayed: 0 }).countDocuments();
  const countUser = await User.find({}).countDocuments();
  const bookCP = await Book.find({ status: true }).countDocuments();
  const bookUCP = await Book.find({ status: false }).countDocuments();
  const book = await Book.find({}).countDocuments();
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const turnover = await Turnover.find({});
  var revenue = 0;
  turnover.forEach((turnover) => {
    revenue = revenue + turnover.turnover;
  });
  res.render("admin/statistical.ejs", {
    book: book,
    TopUser: TopUser,
    userNoPay: userNoPay,
    category: category,
    isAdmin: isAdmin,
    TopPayBook: TopPayBook,
    TopFollowBook: TopFollowBook,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    revenue: revenue,
    bookCP: bookCP,
    bookUCP: bookUCP,
    countUser: countUser,
    userId: userId,
  });
};

exports.getStatisticalBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const check = req.params.check;
  if (check == "all") {
    const book = await Book.find({});
    const totalBook = await Book.find({}).countDocuments();
    res.render("admin/book-statistical.ejs", {
      isAdmin: isAdmin,
      category: category,
      totalBook: totalBook,
      numberNotiAdmin: numberNotiAdmin,
      book: book,
      user: user,
      userId: userId,
    });
  } else if (check == "true" || check == "false") {
    const book = await Book.find({ status: check });
    const totalBook = await Book.find({ status: check }).countDocuments();
    res.render("admin/book-statistical.ejs", {
      isAdmin: isAdmin,
      category: category,
      totalBook: totalBook,
      numberNotiAdmin: numberNotiAdmin,
      book: book,
      user: user,
      userId: userId,
    });
  } else {
    var name = RegExp(req.params.check, "i");
    const book = await Book.find({ category: name });
    const totalBook = await Book.find({ category: name }).countDocuments();
    res.render("admin/book-statistical.ejs", {
      isAdmin: isAdmin,
      category: category,
      totalBook: totalBook,
      numberNotiAdmin: numberNotiAdmin,
      book: book,
      user: user,
      userId: userId,
    });
  }
};

exports.getStatisticalRevenue = async (req, res) => {
  const userId = req.session.userId;
  const year = req.params.year;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const thang = [];
  for (i = 1; i <= 12; i++) {
    const revenue = await Turnover.findOne({
      $and: [{ month: i }, { year: year }],
    });
    if (revenue) {
      thang[i] = revenue.turnover;
    } else {
      thang[i] = 0;
    }
  }
  const yearTurnover = await Turnover.distinct("year");
  res.render("admin/revenue.ejs", {
    isAdmin: isAdmin,
    thang: thang,
    year: year,
    yearTurnover: yearTurnover,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.getStatisticalUser = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const userManage = await User.find({});
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  res.render("admin/user-statistical.ejs", {
    isAdmin: isAdmin,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
    userManage: userManage,
  });
};

exports.getManage = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const userManage = await User.find({});
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  res.render("admin/manage.ejs", {
    isAdmin: isAdmin,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
    userManage: userManage,
  });
};

exports.getSearchUser = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const category = await Category.find({});
  var name = RegExp(req.params.search, "i");
  var userManage = await User.find({ username: name });
  res.render("admin/manage.ejs", {
    isAdmin: isAdmin,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
    userManage: userManage,
  });
};

exports.getSearchListBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const author = await Author.find({});
  var name = RegExp(req.params.search, "i");
  var book = await Book.find({ title: name });
  res.render("admin/book-list.ejs", {
    isAdmin: isAdmin,
    book: book,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    author: author,
    user: user,
    userId: userId,
  });
};

exports.getSearchDeleteBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const category = await Category.find({});
  const author = await Author.find({});
  var name = RegExp(req.params.search, "i");
  var book = await Book.find({ title: name });
  res.render("admin/delete-book.ejs", {
    isAdmin: isAdmin,
    book: book,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    author: author,
    user: user,
    userId: userId,
  });
};

exports.getAddBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const category = await Category.find({});
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  res.render("admin/add-book.ejs", {
    message: req.flash("message-book"),
    isAdmin: isAdmin,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.postAddBook = async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  time = yyyy + "-" + mm + "-" + dd;
  const link = req.body.link;
  const chapter = req.body.chapter;
  for (var j = 1; j <= chapter; j++) {
    const URL = `${link}chuong-${j}/#j_content`;
    const options = {
      url: URL,
      transform: function (body) {
        return cheerio.load(body);
      },
    };
    (async function crawler() {
      try {
        var $ = await requestPromise(options);
      } catch (error) {
        return error;
      }
      const mainContent = $("#j_content");
      for (let i = 0; i < mainContent.length; i++) {
        const book_title = $(".rv-full-story-title a").text().trim();
        const title = $(".rv-chapt-title a").text().trim();
        const content = $(".content_wrap1").find("p").text().trim();
        const number = parseInt(title.match(/[0-9]+/)[0]);
        const chapter = new Chapter({
          book_title: book_title,
          title: title,
          content: content,
          number: number,
        });
        await chapter.save();
      }
    })();
  }

  const book = new Book({
    title: req.body.title,
    price: req.body.price,
    chapter: chapter,
    author: req.body.author,
    category: req.body.category,
    imgURL: req.body.imgURL,
    status: req.body.status,
    date: time,
  });
  await book.save();

  let result = await Author.find({ authorName: req.body.author });
  if (result.length > 0) {
    res.redirect("/admin/add-book");
  } else {
    const author = new Author({
      authorName: req.body.author,
    });
    await author.save();
  }

  req.flash("message-book", "Nhập thành công");
  res.redirect("/admin/add-book");
};

exports.getAddCategory = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const book = await Book.find({});
  const category = await Category.find({});
  res.render("admin/add-category.ejs", {
    message: req.flash("message-addCate"),
    book: book,
    isAdmin: isAdmin,
    category: category,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.postAddCategory = async (req, res) => {
  let result = await Category.find({ categoryName: req.body.category });
  if (result.length > 0) {
    req.flash("message-addCate", "Dữ liệu đã tồn tại");
    res.redirect("/admin/add-book/add-category");
  } else {
    const category = new Category({
      categoryName: req.body.category,
    });
    await category.save();
    req.flash("message-addCate", "Thêm thành công");
    res.redirect("/admin/add-book/add-category");
  }
};

exports.getBookList = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.find({});
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const category = await Category.find({});
  res.render("admin/book-list.ejs", {
    book: book,
    category: category,
    isAdmin: isAdmin,
    numberNotiAdmin: numberNotiAdmin,
    user: user,
    userId: userId,
  });
};

exports.getUpdateBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.findOne({ title: req.params.title });
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const category = await Category.find({});
  res.render("admin/update-book.ejs", {
    message: req.flash("message-update"),
    book: book,
    isAdmin: isAdmin,
    user: user,
    numberNotiAdmin: numberNotiAdmin,
    category: category,
    userId: userId,
  });
};

exports.UpdateBook = async (req, res) => {
  const url = "/admin/book-list/" + req.params.title;
  const book = await Book.findOne({ title: req.params.title });

  book.title = req.body.title;
  book.author = req.body.author;
  book.price = req.body.price;
  book.category = req.body.category;
  book.imgURL = req.body.imgURL;

  await book.save();
  req.flash("message-update", "Cập nhật thành công");
  res.redirect(url);
};

exports.UpdateChapter = async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var mn = today.getMinutes();
  time = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mn;
  const URL = req.body.linkchapter;
  const url = "/admin/book-list/" + req.params.title;
  const options = {
    url: URL,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  (async function crawler() {
    try {
      var $ = await requestPromise(options);
    } catch (error) {
      return error;
    }
    const mainContent = $("#j_content");
    for (let i = 0; i < mainContent.length; i++) {
      const book_title = $(".rv-full-story-title a").text().trim();
      const title = $(".rv-chapt-title a").text().trim();
      const content = $(".content_wrap1").find("p").text().trim();
      const number = parseInt(title.match(/[0-9]+/)[0]);
      const chapter = new Chapter({
        book_title: book_title,
        title: title,
        content: content,
        number: number,
      });
      await chapter.save();
    }
    const listBook = await Follow.find({ bookFollowed: req.params.title });
    const book = await Book.findOne({ title: req.params.title });
    if (listBook) {
      const bookUpdate = await Chapter.findOne({
        book_title: req.params.title,
      }).sort({ number: -1 });
      var i = 0,
        noti = [];
      listBook.forEach((listBook) => {
        noti[i] = {
          notification: "Cập nhật mới: " + bookUpdate.title,
          userId: listBook.userId,
          book: listBook.bookFollowed,
          date: time,
          read: false,
          img: book.imgURL,
        };
        i++;
      });
      Notification.insertMany(noti);
    }
  })();

  const book = await Book.findOne({ title: req.params.title });
  book.status = req.body.status;
  book.chapter = req.body.chapter;
  await book.save();

  req.flash("message-update", "Cập nhật thành công");
  res.redirect(url);
};

exports.getDeleteBook = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  const book = await Book.find();
  const isAdmin = req.session.isAdmin;
  const numberNotiAdmin = await NotificationAdmin.find({
    read: false,
  }).countDocuments();
  const category = await Category.find({});
  res.render("admin/delete-book.ejs", {
    book: book,
    isAdmin: isAdmin,
    numberNotiAdmin: numberNotiAdmin,
    category: category,
    user: user,
    userId: userId,
  });
};

exports.DeleteBook = async (req, res) => {
  if (req.session.isAdmin == true) {
    await Book.deleteOne({ title: req.params.title });
    await Chapter.deleteMany({ book_title: req.params.title });
    res.redirect("/admin/delete-book");
  }
};

exports.DeleteUser = async (req, res) => {
  if (req.session.isAdmin == true) {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/admin/manage");
  }
};

exports.DeleteUser = async (req, res) => {
  if (req.session.isAdmin == true) {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/admin/manage");
  }
};
