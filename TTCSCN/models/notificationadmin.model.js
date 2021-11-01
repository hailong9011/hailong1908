const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationadminSchema = new Schema({
  book: {
    type: String,
    require: true,
  },
  notification: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
  commentId: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  dateComment: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("notificationAdmin", notificationadminSchema);
