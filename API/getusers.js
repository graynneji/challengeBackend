const express = require("express");
const getUsers = express.Router();
const users = require("../connections/users");

getUsers.get("/", async (req, res) => {
  const getAllUsers = await users();
  const response = getAllUsers.find().toArray();

  const responseLength = (await response).length;
  if (responseLength === 0) {
    return res.status(404).send({
      message: "No users found",
    });
  }

  response.then((data) => {
    res.status(200).send(JSON.stringify(data));
  });
});

module.exports = getUsers;
