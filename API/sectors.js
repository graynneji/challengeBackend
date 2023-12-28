const express = require("express");
const getsectors = express.Router();
const postSectors = express.Router();
const sectors = require("../connections/sectors");

getsectors.get("/", async (req, res) => {
  const getAllSectors = await sectors();
  const response = getAllSectors.find().toArray();

  const responseLength = (await response).length;
  if (responseLength === 0) {
    return res.status(404).send({
      message: "No sectors found",
    });
  }

  response.then((data) => {
    res.status(200).send(JSON.stringify(data));
  });
});

// postSectors.post("/", async (req, res) => {
//   try {
//     const sectorsData = req.body;
//     const collection = await sectors();
//     const result = await collection.insertOne({ sectors: sectorsData });

//     res.status(201).json({
//       status: "success",
//       result,
//     });
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = (postSectors, getsectors);
