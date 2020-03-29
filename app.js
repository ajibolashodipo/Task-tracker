const express = require("express");
const axios = require("axios");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1/my_task_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//schema
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  complete: Number
});

const Task = new mongoose.model("Task", taskSchema);

function getQuote() {
  axios
    .get("https://favqs.com/api/qotd")
    .then(function(response) {
      return {
        author: response.data.quote.author,
        quote: response.data.quote.body
      };
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    });
}

app.get("/", (req, res) => {
  async function getQuote() {
    const response = await axios.get("https://favqs.com/api/qotd");
    return response.data.quote;
  }
  getQuote()
    .then(axiosData => {
      Task.find({}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const quoteData = {
            myAuthor: axiosData.author,
            myQuote: axiosData.body
          };
          //console.log(quoteData);
          res.render("home", { tasks: data, quoteData: quoteData });
        }
      });
    })
    .catch(e => {
      console.log("e", e);
    });
});

app.post("/tasks", (req, res) => {
  const formDetail = {
    name: req.body.name,
    description: req.body.description,
    complete: req.body.complete
  };
  console.log(formDetail);
  Task.create(formDetail, (err, task) => {
    if (err) {
      console.log(err);
    } else {
      console.log(task);
      res.redirect("/");
    }
  });
});

//edit
app.get("/tasks/:id/edit", (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.render("edit", { update: data });
    }
  });
});

//update
app.put("/tasks/:id", (req, res) => {
  const formDetail = {
    name: req.body.name,
    description: req.body.description,
    complete: req.body.complete
  };
  console.log(formDetail);
  Task.findByIdAndUpdate(req.params.id, formDetail, (err, updatedTask) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(updatedTask);
      res.redirect("/");
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id, err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("server ti bere lori port 3000");
});
