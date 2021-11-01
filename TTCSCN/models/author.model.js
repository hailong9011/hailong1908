const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  authorName: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("author", authorSchema);
