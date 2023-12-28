const express = require("express");
const postuser = express.Router();
const users = require("../connections/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const SALT = 10;

const userSchema = Joi.object({
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}")),
  repeat_password: Joi.ref("password"),
});

postuser.post("/", async (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    repeat_password: req.body.repeat_password,
  };

  //User Data validation
  const data = userSchema.validate({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    repeat_password: user.repeat_password,
  });

  if (data?.error?.details) {
    return res.status(400).send(data.error.details);
  }

  const email = user.email;

  //Checking if user already exists
  const getAllUsers = await users();
  const userExists = await getAllUsers.findOne({ email });

  if (userExists) {
    return res.status(400).send({
      isRegistered: false,
      message: `User with email ${user.email} already registered !`,
    });
  }

  //Hashing password

  bcrypt.hash(user.password, SALT, async (error, hash) => {
    try {
      const insertUser = await getAllUsers.insertOne({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hash,
        isLoggedIn: false,
        active: true,
      });

      //If insert error, throw error
      if (!insertUser) {
        return res.status(400).send({
          isRegistered: false,
          message: error,
        });
      }

      //User registration succesful
      res.status(200).send({
        isRegistered: true,
        message: `User with email ${user.email} registered successfully !`,
      });
    } catch (err) {
      return res.status(400).send({
        isRegistered: false,
        message: err,
      });
    }
  });
});

module.exports = postuser;
