var express = require("express");
var router = express.Router();
const auth = require("../config/Auth");
var musicController = require("../controller/MusicController");

router
  .post("/musics/:categoryId", musicController.createMusic)
  .get("/users/:userId/musics", musicController.getLikedSongs)
  .post(
    "/users/:userId/like/music/:songId",
    auth.verifyToken,
    musicController.LikeSong
  )
  .delete(
    "/users/:userId/unlike/music/:songId",
    auth.verifyToken,
    musicController.unLikeSong
  )
  .get("/songs/search", musicController.searchSongs)
  .get("/songs/sort", musicController.getSongsByCreatedAt);

module.exports = router;
