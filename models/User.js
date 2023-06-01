var mongoose = require("mongoose");
var Music = require("./Music");
var Album = require("./Album");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music" }],
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
});

userSchema.pre("remove", async function (next) {
  try {
    await Music.deleteMany({ _id: { $in: this.favoriteSongs } });

    await Album.deleteMany({ owner: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.sifreDogrumu = function (password) {
  return this.password == password;
};
userSchema.methods.tokenUret = function () {
  const skt = new Date();
  skt.setDate(skt.getDate() + 7);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      exp: parseInt(skt.getTime() / 1000, 10),
    },
    process.env.SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
