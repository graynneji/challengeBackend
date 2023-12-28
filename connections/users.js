const client = require("../db/config");

const users = async () => {
  await client.connect();
  console.log("Sectors connected successfully");
  const userCollection = client.db("sectorselection").collection("users");
  return userCollection;
};

module.exports = users;
