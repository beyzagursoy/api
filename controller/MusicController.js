const User = require("../models/User");
const Music = require("../models/Music");
var mongoose = require("mongoose");
const Album = require("../models/Album");
const Category = require("../models/Category");

const cevapOlustur = function (res, status, content) {
  res.status(status).json(content);
};

const createMusic = async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId)
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  try {
    const { songName, artistName, image, src } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Albüm bulunamadı." });
    }
    const newSong = await Music.create({ songName, artistName, image, src });

    category.musics.push(newSong);
    await category.save();

    res.json({ message: "Şarkı başarıyla oluşturuldu." });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const LikeSong = async (req, res) => {
  const { userId, songId } = req.params;
  if (!userId || !songId) {
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    const song = await Music.findById(songId);

    if (!song) {
      return res.status(404).json({ error: "Şarkı bulunamadı." });
    }
    // Kullanıcının aynı şarkıyı birden fazla kez beğenmesini kontrol ediyor
    const isSongLiked = user.favoriteSongs.some((likedSong) =>
      likedSong.equals(song._id)
    );

    if (isSongLiked) {
      return cevapOlustur(res, 400, { error: "Bu şarkı zaten beğenildi." });
    }

    user.favoriteSongs.push(song);
    await user.save();

    res.json({ message: "Şarkı başarıyla beğenildi." });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const getLikedSongs = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  try {
    const user = await User.findById(userId).populate("favoriteSongs");

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    cevapOlustur(res, 200, user.favoriteSongs);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const unLikeSong = async (req, res) => {
  const { userId, songId } = req.params;
  if (!userId || !songId) {
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    const song = await Music.findById(songId);

    if (!song) {
      return res.status(404).json({ error: "Şarkı bulunamadı." });
    }
    user.favoriteSongs.pull(song._id);
    await user.save();
    cevapOlustur(res, 200, {
      message: "Şarkı beğenisi başarıyla kaldırıldı.",
    });
  } catch (error) {
    cevapOlustur(res, 400, { message: error.message });
  }
};

const searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    const songs = await Music.find({
      $or: [
        { songName: { $regex: query, $options: "i" } },
        { artistName: { $regex: query, $options: "i" } },
      ],
    }).sort({ likes: -1 });
    return cevapOlustur(res, 200, songs);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

const getSongsByCreatedAt = async (req, res) => {
  try {
    const songs = await Music.find().sort({ createdAt: -1 });

    return cevapOlustur(res, 200, songs);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};
module.exports = {
  createMusic,
  getSongsByCreatedAt,
  LikeSong,
  unLikeSong,
  getLikedSongs,
  searchSongs,
};
