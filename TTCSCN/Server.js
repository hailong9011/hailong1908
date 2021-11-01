const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParse = require("cookie-parser");
const flash = require("connect-flash");

const authMiddleware = require("./middleware/auth.middleware");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(flash());

const homepageRoute = require("./routes/homepage");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const adminRoute = require("./routes/admin");

app.use("/book", bookRoute);
app.use("/", homepageRoute);
app.use("/", authMiddleware.requireAuth, userRoute);
app.use("/admin", authMiddleware.requireAuthAdmin, adminRoute);

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/webdoctruyen", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to the database");
});

app.get("/", (reg, res) => {
  res.render("home");
});

app.set("view engine", "ejs");

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
