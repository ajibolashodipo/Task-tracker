const express = require("express");
const axios = require("axios");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const dotenv = require("dotenv");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/user");

const User = require("./models/Users");

const { envPort, databaseURL } = require("./config");
dotenv.config();
const app = express();

let url = databaseURL || "mongodb://127.0.0.1/my_task_app";
let port = envPort || 8080;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//routes
app.use("/", indexRoute);
app.use("/users", userRoute);

//app.use(bodyParser.json());

//schema

// User.create({
//   username: "shaddy@gmail.com",
//   password: "dollar",
// });

// Task.create({});

app.listen(port, () => {
  console.log(`server ti bere lori port ${port}`);
});
