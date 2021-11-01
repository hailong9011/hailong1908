const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
    require: true,
  },
  imgURL: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  follow: {
    type: Number,
    require: true,
    default: 0,
  },
  date: {
    type: String,
    required: true,
  },
  numberUserPayFor: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Book", bookSchema);
