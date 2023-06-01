var express = require("express");
var router = express.Router();
const albumController = require("../controller/AlbumController");

router
  .post("users/:userId/albums", albumController.createAlbum)
  .post("/albums/:albumId/add/musics/:songId", albumController.addSongToAlbum)
  .get("/albums/:albumId", albumController.getAlbumById)
  .get("/albums/", albumController.getAllAlbums)
  .get("/albums/:albumId/musics", albumController.getAlbumSongs)
  .get("/users/:userId/albums", albumController.getUserAlbums);

module.exports = router;
