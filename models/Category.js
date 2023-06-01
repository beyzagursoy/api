const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  musics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
