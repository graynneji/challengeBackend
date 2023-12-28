const client = require("../db/config");

const sectors = async () => {
  await client.connect();
  console.log("Sectors connected successfully");
  const sectorCollection = client.db("sectorselection").collection("sectors");
  return sectorCollection;
};

module.exports = sectors;
