const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  totalCash: {
    type: Number,
    required: true,
    default: 0,
  },
  cashRecharged: {
    type: Number,
    required: true,
    default: 0,
  },
  avatar: {
    type: String,
    required: true,
  },
  cashPayed: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
