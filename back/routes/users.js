var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .then((result) => {
      if (result.length < 1) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(404);
          } else {
            const user = new User({
              password: hash,
              email: req.body.email,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(202).json({
                  message: "patient added",
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: err,
                });
              });
          }
        });
      } else {
        res.status(409).json({
          message: "this patient already exist",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

/////////////////////////////////////////////////

//private key
const privateKey = "ojzjheZZErzd234zERZfé2";

// sign in
router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: "Auth failed",
        });
        return;
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
          res.status(401).json({
            message: "Auth failed",
          });
          return;
        }

        // create token with 1 hour expiry time
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          privateKey,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "Auth successful",
          token: token,
          patient: user._id,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error: " + err,
      });
    });
});

module.exports = router;
