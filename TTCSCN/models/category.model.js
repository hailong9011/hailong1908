const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("category", categorySchema);
