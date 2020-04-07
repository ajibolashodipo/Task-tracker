const mongoose = require("mongoose");
const Task = require("../models/Tasks");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId, //in the user schema there is a posts attribute and it is an array of object ids
      ref: "Task",
    },
  ],
});
const User = new mongoose.model("User", userSchema);

module.exports = User;
