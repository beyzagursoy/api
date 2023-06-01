const experss = require("express");
const router = experss.Router();
const jsonwebtoken = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }

  let tokenWithoutBearer = token.split(" ")[1];

  try {
    const decoded = jsonwebtoken.verify(
      tokenWithoutBearer,
      process.env.SECRET_KEY
    );
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Geçersiz token." });
  }
};

module.exports = {
  verifyToken,
};
