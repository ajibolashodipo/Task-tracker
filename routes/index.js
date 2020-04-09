const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const router = express.Router();

// function getQuote() {
//   axios
//     .get("https://favqs.com/api/qotd")
//     .then(function (response) {
//       return {
//         author: response.data.quote.author,
//         quote: response.data.quote.body,
//       };
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     });
// }

// async function getQuote() {
//   const response = await axios.get("https://favqs.com/api/qotd");

//   const { author, body } = response.data.quote;

//   return {
//     myAuthor: author,
//     myQuote: body,
//   };
// }

router.get("/", (req, res) => {
  //console.log(req.user);
  // const quoteData = await getQuote();

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
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      req.flash("error_msg", "Username already exists.");
      res.redirect("/register");
    } else {
      //hash password
      bcrypt.genSalt(8, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            req.flash("error_msg", "An error occurred. Try again");
            res.redirect("/register");
          } else {
            signUpData.password = hash;
            User.create(signUpData, (err, registerData) => {
              if (err) {
                req.flash("error_msg", "An error occurred. Try again");
                res.redirect("/register");
              } else {
                req.flash("success_msg", "Sign up successful. Please log in");
                res.redirect("/login");
              }
            });
          }
        });
      });
    }
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
  req.flash("success_msg", "Logout successful");
  res.redirect("/login");
});

module.exports = router;
