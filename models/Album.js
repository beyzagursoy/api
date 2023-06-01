const mongoose = require("mongoose");
const Music = require("./Music");
const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  musics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
