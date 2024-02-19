const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

exports.signup = (req, res, next) => {
  console.log("[controllers/auth.js/signup] req.body:", req.body);
  const { email, name, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("[controllers/auth.js/signup] errors:", errors.array());

    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  //create new User
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return User.create({
        email,
        name,
        password: hashedPassword,
      });
    })
    .then((user) => {
      console.log("[controllers/auth.js/signup] user:", user);

      res.status(201).json({
        message: "User created successfully",
        userId: user._id,
      });
    })
    .catch((err) => {
      console.log("[controllers/auth.js/signup] err:", err);
      next(err);
    });
};

exports.login = (req, res, next) => {
  console.log("[controllers/auth.js/login] req.body:", req.body);
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("A user with this email could not be found");
        err.statusCode = 404;
        throw err;
      }

      //means user is there, Now compare the password

      bcrypt.compare(password, user.password).then((isEqual) => {
        if (!isEqual) {
          const err = new Error("Wrong password");
          err.statusCode = 401;
          throw err;
        }

        //means password is correct, now send token
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          "thisissecretkey",
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          token: token,
          userId: user._id.toString(),
        });
      });
    })
    .catch((err) => {
      console.log("[controllers/auth.js/login] err:", err);
      next(err);
    });
};