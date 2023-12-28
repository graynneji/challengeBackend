require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
// const dburl = process.env.DB_URL;
const dburl = process.env.DB;

//Setting up API version and connectiong to db.
const client = new MongoClient(dburl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = client;
