const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/statistical", adminController.getStatistical);
router.get("/manage", adminController.getManage);
router.get("/manage/search/:search", adminController.getSearchUser);
router.get("/book-list/search/:search", adminController.getSearchListBook);
router.get("/delete-book/search/:search", adminController.getSearchDeleteBook);
router.get("/add-book", adminController.getAddBook);
router.get("/delete-book", adminController.getDeleteBook);
router.get("/add-book/add-category", adminController.getAddCategory);
router.get("/book-list", adminController.getBookList);
router.get("/book-list/:title", adminController.getUpdateBook);
router.post("/add-book", adminController.postAddBook);
router.post("/add-book/add-category", adminController.postAddCategory);
router.put("/book-list/story/:title", adminController.UpdateBook);
router.put("/book-list/chapter/:title", adminController.UpdateChapter);
router.delete("/delete-book/:title", adminController.DeleteBook);
router.delete("/manage/delete-user/:id", adminController.DeleteUser);

module.exports = router;
