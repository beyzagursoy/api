const User = require("../models/User");
const Music = require("../models/Music");
var mongoose = require("mongoose");
const Album = require("../models/Album");
const Category = require("../models/Category");

const cevapOlustur = function (res, status, content) {
  res.status(status).json(content);
};

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await Category.create({ categoryName });

    cevapOlustur(res, 200, {
      message: "Kategori başarıyla oluşturuldu.",
      category,
    });
  } catch (error) {
    console.error("Hata:", error);
    cevapOlustur(res, 500, { error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return cevapOlustur(res, 400, { hata: "Tüm alanlar gereklidir." });
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return cevapOlustur(res, 404, { mesaj: "Kategori bulunamadi." });
    }

    await Category.findByIdAndRemove(categoryId);
    return cevapOlustur(res, 200, { durum: "Kategori silindi." });
  } catch (error) {
    console.error("Hata:", error);
    return cevapOlustur(res, 500, { hata: "Bir hata oluştu." });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return cevapOlustur(res, 200, categories);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return cevapOlustur(res, 500, { hata: "tum alanlar gerekli" });
  }
  try {
    const { categoryName } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Kategori bulunamadı." });
    }

    category.categoryName = categoryName;
    await category.save();
    return cevapOlustur(res, 200, {
      message: "Kategori başarıyla güncellendi.",
      category,
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSongsInCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  }
  try {
    const category = await Category.findById(categoryId).populate("musics");

    if (!category) {
      return res.status(404).json({ error: "Kategori bulunamadı." });
    }

    const songs = category.musics;

    cevapOlustur(res, 200, songs);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCategory,
  getSongsInCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
};
