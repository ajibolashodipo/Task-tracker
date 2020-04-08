const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/Users");

module.exports = function (passport) {
  console.log("sadeeeee");
  passport.use(
    new LocalStrategy((username, password, done) => {
      console.log("fooooooooooodddddddd");
      // Match user
      User.findOne({
        username: username,
      }).then((user) => {
        console.log("asebayooooooooooo");
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log(password);
          console.log(user.password);
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
