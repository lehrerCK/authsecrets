//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = 3000;

const app = express();

//console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

/*
const userSchema = {
  email: String,
  password: String
};
*/
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//const secret = "This is our little secret.";
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});


app.post("/register", function(req, res) {
  new User({
    email: req.body.username,
    password: req.body.password})
  .save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log(foundUser.email + " is found in the database and has the password: " + foundUser.password);
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          //password wrong
        }
      } else {
        //no such user
      }
    }
  });
});




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
