const express = require("express");
const axios = require("axios");
const Task = require("../models/Tasks");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
//const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const User = require("../models/Users");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("landing");
});

//show sign up form
router.get("/register", function (req, res) {
  res.render("register");
});

//register;
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const signUpData = {
    username: req.body.username,
    password: req.body.password,
  };
  //hash password
  bcrypt.genSalt(8, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        signUpData.password = hash;
        User.create(signUpData, (err, registerData) => {
          if (err) {
            console.log(err);
          } else {
            //console.log("user created with " + registerData);
            req.flash("success_msg", "You are now registered. Please log in");
            res.redirect("/login");
          }
        });
      }
    });
  });
});

//login;
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// router.post("/login", function (req, res, next) {
//   passport.authenticate("local", function (err, user, info) {
//     console.log(req.body.username);
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect("/");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }
//       return res.redirect("/users/" + user.username + "/tasks");
//     });
//   })(req, res, next);
// });

//login simplified
// router.post(
//   "/login",
//   passport.authenticate("local", { failureRedirect: "/" }),
//   function (req, res) {
//     res.redirect("/");
//     // res.redirect("/users/" + req.body.username + "/tasks");
//   }
// );

// Login Brad Traversy
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/users/" + req.body.username + "/tasks",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// router.post("/login", (req, res) => {
//   let pseudo = req.body.username;
//   // let pseudo = "5e8b2e0d2e157323748cf29a";

//   //res.send("login accepted");
//   res.redirect("/users/" + pseudo + "/tasks");
// });

//logout
router.get("/logout", function (req, res) {
  req.logout(); //logs them out via passport
  res.redirect("/login");
});

//LOGIN Handle

module.exports = router;
