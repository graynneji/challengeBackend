const express = require("express");
const loginUser = express.Router();
const users = require("../connections/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}")),
});

loginUser.post("/", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  //User Data validation
  const data = userSchema.validate({
    email: user.email,
    password: user.password,
  });

  if (data?.error?.details) {
    return res.status(400).send(data.error.details);
  }

  const email = user.email;

  //Checking if user already exists
  const getAllUsers = await users();
  const userExists = await getAllUsers.findOne({ email });

  if (!userExists) {
    return res.status(400).send({
      isLoggedIn: false,
      message: `No user with email ${user.email} exists !`,
    });
  }

  //Login user with comparing hashed password
  bcrypt.compare(user.password, userExists.password, async (error, result) => {
    try {
      if (!result) {
        return res.status(400).send({
          isLoggedIn: false,
          message: `Password Incorrect !`,
        });
      }

      const updateResponse = await getAllUsers.updateOne(
        { email },
        { $set: { isLoggedIn: true } }
      );

      if (!updateResponse.acknowledged) {
        return res.status(400).send({
          isLoggedIn: false,
          message: `Something went wrong !`,
        });
      }

      res.status(200).send({
        isLoggedIn: updateResponse.acknowledged,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        id: userExists._id,
        email: userExists.email,
      });
    } catch (error) {
      return res.status(400).send({
        isLoggedIn: false,
        message: "User already logged in",
        error: error,
      });
    }
  });
});

module.exports = loginUser;
