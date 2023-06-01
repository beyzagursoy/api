const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          console.log("buraya");
          return done(null, false, { message: "Yanlış Kullanıcı adı" });
        }
        if (!user.sifreDogrumu(password)) {
          return done(null, false, { message: "Yanlış Şifre" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
