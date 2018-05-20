const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db config
const db = require("./config/keys").mongoURI;

// connect to mongo db
mongoose
  .connect(db)
  .then(() => console.log("mongo db connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passpot Config
require("./config/passport.js")(passport);

// use routes

app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is up on port ${port}`));
