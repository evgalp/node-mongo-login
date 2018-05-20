const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load User model
const User = require("../../models/User");
const passport = require("passport");

// @route GET api/users/test
// @desc Test users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
  let errors = {};

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login user - returning JWT token
// @access Public

router.post("/login", (req, res) => {
  let errors = {};

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email: email }).then(user => {
    // check email
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched

        //Create JWT payload
        const payload = { id: user.id, name: user.name };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
