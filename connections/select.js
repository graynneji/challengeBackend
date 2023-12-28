const client = require("../db/config");

const select = async () => {
  await client.connect();
  console.log("select connected successfully");
  const userCollection = client.db("sectorselection").collection("select");
  return userCollection;
};

module.exports = select;
