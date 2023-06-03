const User = require("../models/User");
var mongoose = require("mongoose");
const passport = require("passport");
const cevapOlustur = function (res, status, content) {
  res.status(status).json(content);
};

const kayitOl = async function (req, res) {
  const { email, username, password } = req.body;
  if (!username || !email) {
    return cevapOlustur(req, 400, { hata: "Bütün alanlar gereklidir" });
  }
  try {
    const userDb = await User.findOne({ email: email });
    if (userDb) {
      return cevapOlustur(res, 400, { hata: "Bu email kullanılıyor" });
    }

    const user = await User.create({
      email: email,
      password: password,
      username: username,
    });
    cevapOlustur(res, 201, user);
  } catch (error) {
    cevapOlustur(res, 400, { hata: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return cevapOlustur(res, 400, { hata: "tum alanlar gerekli" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanici bulunamadi." });
    }

    await user.remove();

    res.json({ message: "Kullanici başariyla silindi." });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const loggedInUser = (req, res) => {
  if (!req.session.user)
    return cevapOlustur(res, 401, { error: "Oturum bulunamadi." });

  return cevapOlustur(res, 200, { user: req.session.user });
};

const girisYap = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ mesaj: "Tüm alanlar gerekli." });
  }
  passport.authenticate("local", (err, user, info) => {
    let token;
    if (err) {
      return res.status(404).json(err.message);
    }
    if (user) {
      req.session.user = user;
      token = user.tokenUret();
      res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
};

const getUser = async function (req, res) {
  const userid = req.params.userid;
  try {
    const user = await User.findById(userid);
    if (user) {
      cevapOlustur(res, 200, user);
    } else {
      cevapOlustur(res, 404, { hata: "user bulunamadi" });
    }
  } catch (error) {
    cevapOlustur(res, 404, error);
  }
};

const changePassword = async (req, res) => {
  if (!req.session.user)
    return cevapOlustur(res, 401, { error: "Oturum bulunamadi." });
  const { _id: userId } = req.session.user;

  const { currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Tüm alanlar gereklidir." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const isPasswordValid = await user.sifreDogrumu(currentPassword);

    if (!isPasswordValid) {
      return cevapOlustur(res, 401, { error: "Mevcut şifre hatalı." });
    }

    user.password = newPassword;
    await user.save();

    return cevapOlustur(res, 200, { message: "Şifre başariyla değiştirildi." });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async function (req, res) {
  const { userid } = req.params;
  if (!userid) {
    return cevapOlustur(res, 404, { hata: "hata" });
  }
  const { email, password, image, username } = req.body;
  if (!userid || !email || !image || !username) {
    cevapOlustur(res, 400, { durum: "butun alanlari doldur" });
  } else {
    try {
      const user = await User.findById(userid);
      user.username = username;
      user.email = email;
      user.password = password;
      user.image = image;
      try {
        const save = await user.save();
        cevapOlustur(res, 200, save);
      } catch (error) {
        cevapOlustur(res, 400, error.message);
      }
    } catch (error) {
      cevapOlustur(res, 500, error.message);
    }
  }
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      return cevapOlustur(res, 200, users);
    })
    .catch((error) => {
      return cevapOlustur(res, 400, error);
    });
};

passport.serializeUser(function (user, done) {
  console.log("Serialize user called.");
  done(null, user._id);
});

passport.deserializeUser(function (user, done) {
  User.findById(id.toString(), (err, user) => {
    done(err, user);
  });
});

module.exports = {
  kayitOl,
  getUser,
  deleteUser,
  updateUser,
  getUsers,
  girisYap,
  changePassword,
  loggedInUser,
};
