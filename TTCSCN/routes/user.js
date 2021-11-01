const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/info", userController.getInfo);
router.get("/recharge/:title/:cash", userController.getPay);
router.get("/password", userController.getUpdatePassword);
router.get("/recharge", userController.getRecharge);
router.post(
  "/recharge/pay/:bank/:cash/:time/:book/:money",
  userController.Recharge
);
router.post("/recharge/paybook/:title/:cash/:time", userController.PayForBook);
router.post("/comment/:time/:comment", userController.postHotComment);
router.post("/info/delete-cmt/:id", userController.deleteCmt);
router.post("/report/:id/:time", userController.postNotiHome);
router.put("/password", userController.updatePassword);
router.put("/info/username/:username", userController.updateUsername);
router.put("/info/notification/:id", userController.updateNoti);
router.put("/info", userController.updateNotiAdmin);
router.delete("/delete/:id", userController.deleteCommentHome);

module.exports = router;
