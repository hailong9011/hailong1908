const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  bookFollowed: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
