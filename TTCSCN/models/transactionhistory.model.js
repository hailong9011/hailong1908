const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionhistorySchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  surplus: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("transactionHistory", transactionhistorySchema);
