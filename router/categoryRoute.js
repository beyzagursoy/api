var express = require("express");
var router = express.Router();
var categoryController = require("../controller/CategoryController");

router
  .post("/categories", categoryController.createCategory)
  .delete("/categories/:categoryId", categoryController.deleteCategory)
  .put("/categories/:categoryId", categoryController.updateCategory)
  .get("/categories", categoryController.getAllCategories)
  .get("/categories/:categoryId/musics", categoryController.getSongsInCategory);

module.exports = router;
