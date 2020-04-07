const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  complete: String,
  duration: String,
});

const Task = new mongoose.model("Task", taskSchema);

module.exports = Task;
