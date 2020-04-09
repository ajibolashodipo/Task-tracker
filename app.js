const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const mongoose = require("mongoose");
const moment = require("moment");
const dotenv = require("dotenv");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/user");
const flash = require("connect-flash");
const User = require("./models/Users");
const passportConfig = require("./authConfig/passportConfig");

const { envPort, databaseURL } = require("./config");
dotenv.config();
const app = express();

//passport config
passportConfig(passport);

let url = databaseURL || "mongodb://127.0.0.1/my_task_app";
let port = envPort || 8080;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//remember false is default in the urlencoded.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//express-session
app.use(
  session({
    //require inline exp session
    secret: "be kind always", //used to encode and decode data during session (it's encrypted)
    resave: true, // required
    saveUninitialized: true, //required
  })
);

//Passport middleware..put passport shit after express-session middleware
// code to set up passport to work in our app -> THESE TWO METHODS/LINES ARE REQUIRED EVERY TIME
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.erros_msg = req.flash("error_msg");
  next();
});

//routes
app.use("/", indexRoute);
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`server ti bere lori port ${port}`);
});
