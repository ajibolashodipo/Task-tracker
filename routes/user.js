const express = require("express");
//const app = express();
const axios = require("axios");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const moment = require("moment");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const isLoggedIn = require("../middleware/isLoggedIn");
const Task = require("../models/Tasks");
const User = require("../models/Users");
const { ensureAuthenticated } = require("../authConfig/authGuard");

const router = express.Router();

//app.use(methodOverride("_method"));

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

router.get("/:username/tasks", ensureAuthenticated, async (req, res) => {
  const quoteData = await getQuote();
  //console.log(req.params);
  let userID = req.params.username;

  const myUser = await User.findOne({ username: userID })
    .populate("tasks")
    .exec();
  // await console.log(myUser);

  res.render("home", { userID, myUser, quoteData });
});

//post route
router.post("/:username/tasks", ensureAuthenticated, (req, res) => {
  //console.log("SHITTY MEN");
  const formDetail = {
    name: req.body.name,
    description: req.body.description,
    complete: req.body.complete,
    duration: getDuration(req.body.complete),
  };
  //console.log(formDetail);
  // Task.create(formDetail, async (err, task) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     try {
  //       let foundUser = await User.find({
  //         username: req.params.username,
  //       }).exec();
  //       //await console.log(task);
  //       //await console.log(foundUser);
  //       let pushUser = await foundUser.tasks.push(task);
  //       let savedUser = await pushUser.save();

  //       await console.log(pushUser);

  //       res.redirect("/users/" + req.params.username + "/tasks");
  //     } catch (e) {
  //       res.send("an error occurred");
  //     }
  //   }
  // });

  Task.create(formDetail, (err, task) => {
    if (err) {
      console.log(err);
    } else {
      User.findOne({ username: req.params.username }, (err, foundUser) => {
        if (err) {
          console.log(err);
        } else {
          foundUser.tasks.push(task);
          foundUser.save((err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log(data);
              res.redirect("/users/" + req.params.username + "/tasks");
            }
          });
        }
      });
    }
  });
});
//edit
router.get("/:username/tasks/:taskID/edit", ensureAuthenticated, (req, res) => {
  let userID = req.params.username;
  let id = mongoose.Types.ObjectId(req.params.taskID);

  // console.log(typeof taskID);
  //res.send("ajibola");
  Task.findOne({ _id: id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      res.render("edit", { update: data, userID: userID, taskID: id });
    }
  });

  // User.findOne({ username: userID })
  //   .populate("tasks")
  //   .exec((err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("edit", { update: data, userID: userID, taskID: taskID });
  //     }
  //   });
});

//update
router.put("/:username/tasks/:taskID", ensureAuthenticated, (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.taskID);
  const formDetail = {
    name: req.body.name,
    description: req.body.description,
    complete: req.body.complete,
    duration: getDuration(req.body.complete),
  };
  console.log(formDetail);
  Task.findByIdAndUpdate(id, formDetail, (err, updatedTask) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(updatedTask);
      res.redirect("/users/" + req.params.username + "/tasks");
    }
  });
  // console.log("shittyyyy");
  //res.send("ajibolaa");
});

router.delete("/:username/tasks/:taskID", ensureAuthenticated, (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.taskID);
  Task.findOneAndDelete({ _id: id }, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/users/" + req.params.username + "/tasks");
  });
  //res.send("fridayyyy");
});

function getDuration(time) {
  let now = moment().format("HH:mm:ss");
  let splitTime = now.split(":");
  let nowHours = parseInt(splitTime[0]);
  let nowMinutes = parseInt(splitTime[1]);
  let nowSeconds = parseInt(splitTime[2]);

  let duration = moment.duration({
    hours: nowHours,
    minutes: nowMinutes,
    seconds: nowSeconds,
  });
  let sub = moment(time, "HH:mm").subtract(duration).format("HH:mm:ss");
  //
  console.log(sub);
  return sub;
  //e.preventDefault();
}

module.exports = router;
