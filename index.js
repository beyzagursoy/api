const express = require("express");
require("dotenv").config();
const userRoute = require("./router/userRoute");
const categoryRoute = require("./router/categoryRoute");
const musicRoute = require("./router/musicRoute");
const albumRoute = require("./router/albumRoute");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("./repo/db");
require("./config/passport");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  })
);

app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", musicRoute);
app.use("/api", albumRoute);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type,Accept, Authorization"
  );
  next();
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Oturum silindi" });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ hata: err.name + "" + err.message });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
