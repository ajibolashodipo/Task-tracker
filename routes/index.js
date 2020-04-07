const express = require("express");
const axios = require("axios");
const Task = require("../models/Tasks");
const User = require("../models/Users");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("landing");
});

//register
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  const signUpData = {
    username: req.body.username,
    password: req.body.password,
  };
  User.create(signUpData, (err, registerData) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user created with " + registerData);
      res.redirect("/login");
    }
  });
});

//login
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  let pseudo = req.body.username;
  // let pseudo = "5e8b2e0d2e157323748cf29a";

  //res.send("login accepted");
  res.redirect("/users/" + pseudo + "/tasks");
});

module.exports = router;
