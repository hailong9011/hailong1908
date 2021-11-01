const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  book: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  hotComment: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("comment", commentSchema);
