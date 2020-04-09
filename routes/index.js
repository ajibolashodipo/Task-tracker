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

function getQuote() {
  axios
    .get("https://favqs.com/api/qotd")
    .then(function (response) {
      return {
        author: response.data.quote.author,
        quote: response.data.quote.body,
      };
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

async function getQuote() {
  const response = await axios.get("https://favqs.com/api/qotd");

  const { author, body } = response.data.quote;

  return {
    myAuthor: author,
    myQuote: body,
  };
}

router.get("/", async (req, res) => {
  const quoteData = await getQuote();

  res.render("landing", { quoteData });
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

// Login Brad Traversy
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/" + req.body.username + "/tasks",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

//logout
router.get("/logout", function (req, res) {
  req.logout(); //logs them out via passport
  res.redirect("/login");
});

module.exports = router;
