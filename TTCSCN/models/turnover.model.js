const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const turnoverSchema = new Schema({
  turnover: {
    type: Number,
    require: true,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("turnover", turnoverSchema);
