const express = require("express");
const logoutUser = express.Router();
const users = require("../connections/users");

logoutUser.post("/", async (req, res) => {
  const email = req.body.email;

  //Checking if user already exists
  const getAllUsers = await users();
  const userExists = await getAllUsers.findOne({ email });

  if (!userExists) {
    return res.status(400).send({
      isLoggedIn: false,
      message: `User is not logged in`,
    });
  }

  //Logout user
  const updateResponse = await getAllUsers.updateOne(
    { email },
    { $set: { isLoggedIn: false } }
  );

  if (!updateResponse.acknowledged) {
    return res.status(400).send({
      isLoggedIn: false,
      message: `Something went wrong !`,
    });
  }

  try {
    res.status(200).send({
      isLoggedIn: false,
      message: `User logged out successfully !`,
    });
  } catch (err) {
    return res.status(400).send({
      isLoggedIn: false,
      message: err,
    });
  }
});

module.exports = logoutUser;
