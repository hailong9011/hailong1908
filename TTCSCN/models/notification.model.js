const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  book: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    required: true,
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
  img: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
