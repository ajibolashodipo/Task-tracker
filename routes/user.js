const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const Task = require("../models/Tasks");
const User = require("../models/Users");
const { ensureAuthenticated } = require("../authConfig/authGuard");
const router = express.Router();

router.get("/:username/tasks", ensureAuthenticated, async (req, res) => {
  try {
    let userID = req.params.username;
    // console.log(req.user);
    const myUser = await User.findOne({ username: userID })
      .populate("tasks")
      .exec();
    res.render("home", { userID, myUser });
  } catch (err) {
    req.flash("error_msg", "An error occurred. Try again");
    res.redirect("/login");
  }
});

//post route
router.post("/:username/tasks", ensureAuthenticated, (req, res) => {
  const formDetail = {
    name: req.body.name,
    description: req.body.description,
    complete: req.body.complete,
    duration: getDuration(req.body.complete),
  };

  Task.create(formDetail, (err, task) => {
    if (err) {
      // console.log(err);
      req.flash("error_msg", "An error occurred. Try again");
      res.redirect("/users/" + req.params.username + "/tasks");
    } else {
      User.findOne({ username: req.params.username }, (err, foundUser) => {
        if (err) {
          req.flash("error_msg", "An error occurred. Try again");
          res.redirect("/users/" + req.params.username + "/tasks");
        } else {
          foundUser.tasks.push(task);
          foundUser.save((err, data) => {
            if (err) {
              // console.log(err);
            } else {
              //console.log(data);
              req.flash("success_msg", "Task Added Successfully");
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

  Task.findOne({ _id: id }, (err, data) => {
    if (err) {
      req.flash("error_msg", "An error occurred. Try again");
      res.redirect("/users/" + req.params.username + "/tasks");
    } else {
      res.render("edit", { update: data, userID: userID, taskID: id });
    }
  });
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

  Task.findByIdAndUpdate(id, formDetail, (err, updatedTask) => {
    if (err) {
      req.flash("error_msg", "An error occurred. Try again");
      res.redirect("/users/" + req.params.username + "/tasks");
    } else {
      req.flash("success_msg", "Task Updated Successfully");
      res.redirect("/users/" + req.params.username + "/tasks");
    }
  });
});

router.delete("/:username/tasks/:taskID", ensureAuthenticated, (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.taskID);
  Task.findOneAndDelete({ _id: id }, (err) => {
    if (err) {
      req.flash("error_msg", "Could not delete task. Try again");
      res.redirect("/users/" + req.params.username + "/tasks");
      return;
    }

    //remove id from User model
    //to be implemented soon

    req.flash("success_msg", "Task Deleted Successfully");
    res.redirect("/users/" + req.params.username + "/tasks");
  });
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
  return sub;
}

module.exports = router;
