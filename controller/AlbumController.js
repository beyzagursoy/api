const Album = require("../models/Album");
const User = require("../models/User");
var mongoose = require("mongoose");

const cevapOlustur = function (res, status, content) {
  return res.status(status).json(content);
};

const createAlbum = async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return cevapOlustur(res, 400, { message: "tum alanlar gerekli" });
  try {
    const { title, image } = req.body;
    const album = await Album.create({
      title,
      image,
      owner: userId,
    });
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { albums: album._id } },
      { new: true }
    );
    return cevapOlustur(res, 200, {
      message: "Albüm başariyla oluşturuldu.",
      album,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    return cevapOlustur(res, 200, albums);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};
const getAlbumById = async (req, res) => {
  const { albumId } = req.params;
  if (!albumId) {
    return cevapOlustur(req, 200, { hata: "tum alanlar gerekli" });
  }
  try {
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: "Albüm bulunamadı." });
    }
    cevapOlustur(res, 200, album);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};
const addSongToAlbum = async (req, res) => {
  const { albumId, songId } = req.params;

  if (!albumId || !songId) {
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  }
  try {
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: "Albüm bulunamadı." });
    }
    album.musics.push(songId);
    await album.save();
    return cevapOlustur(res, 200, {
      message: "Şarkı albüme başarıyla eklendi.",
      album,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

const getUserAlbums = async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return cevapOlustur(res, 400, { hata: "Kullanici ID gereklidir." });

  try {
    const user = await User.findById(userId).populate("albums");

    if (!user)
      return cevapOlustur(res, 401, { error: "Kullanici bulunamadi." });

    return cevapOlustur(res, 200, user.albums);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAlbumSongs = async (req, res) => {
  const { albumId } = req.params;
  if (!albumId) return cevapOlustur(res, 200, { hata: "tum alanlar gerekli" });

  try {
    const album = await Album.findById(albumId).populate("musics");

    if (!album) {
      return res.status(404).json({ error: "Albüm bulunamadı." });
    }
    return cevapOlustur(res, 200, { musics: album.musics });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

module.exports = {
  getAlbumSongs,
  addSongToAlbum,
  createAlbum,
  getAlbumById,
  getAllAlbums,
  getUserAlbums,
};
