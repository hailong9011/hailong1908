const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/book");

router.get("/search/:search", bookControllers.getSearchBook);
router.get("/search", bookControllers.getSearchPage);
router.get("/followed-book", bookControllers.getFbook);
router.get("/:title", bookControllers.getBookInfo);
router.get("/:titleBook/:title", bookControllers.getChapter);
router.post("/search", bookControllers.getFilterSearch);
router.post("/comment/:title/:time/:comment", bookControllers.postComment);
router.post("/follow/:title/:result/:follow", bookControllers.postFollow);
router.post("/report/:title/:id/:time", bookControllers.postNoti);
router.delete("/delete/:title/:id", bookControllers.deleteComment);

module.exports = router;
