const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/user");
const flash = require("connect-flash");
const passportConfig = require("./authConfig/passportConfig");
const { envPort, databaseURL } = require("./config");
dotenv.config();
const app = express();

//passport config
passportConfig(passport);

let url = databaseURL || "mongodb://127.0.0.1/my_task_app";
let port = envPort || 8080;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//remember false is default in the urlencoded.

app.use(bodyParser.urlencoded({ extended: false }));
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

//connect flash
app.use(flash());

//Passport middleware..add these lines after express-session middleware. Pretty important
app.use(passport.initialize());
app.use(passport.session());

//global variables.
//Place req.user after passport initialization though
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", indexRoute);
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`server ti bere lori port ${port}`);
});
