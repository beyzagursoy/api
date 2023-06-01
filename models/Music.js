const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  songName: { type: String, required: true },
  image: { type: String },
  src: { type: String, required: true },
  artistName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
