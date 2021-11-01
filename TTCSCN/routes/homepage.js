const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepage");

router.get("/login", homepageController.getFormLogin);
router.get("/", homepageController.getHomepage);
router.post("/login", homepageController.postLogin);
router.get("/logout", homepageController.getLogout);
router.get("/registry", homepageController.getFormRegistry);
router.post("/registry", homepageController.Registry);

module.exports = router;
