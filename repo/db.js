var mongoose = require("mongoose");
var dbURI =
  "mongodb+srv://orion:pas123@cluster0.phwdulh.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI);

mongoose.connection.on("connected", function () {
  console.log(dbURI + " adresindeki veritabanina bağlanildi!\n");
});

mongoose.connection.on("error", function () {
  console.log("Baglanti hatasi!");
});

mongoose.connection.on("disconnected", function () {
  console.log("Baglanti kesildi!");
});

function kapat(msg, callback) {
  mongoose.connection.close(function () {
    console.log(msg);
    callback();
  });
}
process.on("SIGINT", function () {
  kapat("Uygulama Kapatıldı!", function () {
    process.exit(0);
  });
});
require("../models/User");
require("../models/Music");
require("../models/Album");
