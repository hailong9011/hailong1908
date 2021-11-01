const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  number: {
    type: Number,
    require: true,
  },
  book_title: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("chapter", chapterSchema);
