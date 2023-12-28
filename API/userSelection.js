const express = require("express");
const userSelection = express.Router();
const { ObjectId } = require("mongodb");
const getSelectCollection = require("../connections/select");
const Joi = require("joi");

const selectionSchema = Joi.object({
  userId: Joi.string().required(),
  fullName: Joi.string().min(3).max(30),
  sector: Joi.string().min(3).max(30),
  agree: Joi.boolean(),
});

userSelection.post("/", async (req, res) => {
  try {
    const { error } = selectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userId, fullName, sector, agree } = req.body;

    // Call the function to get the collection
    const selectCollection = await getSelectCollection();

    //check if userId exist
    const existingSelection = await selectCollection.findOne({ userId });

    if (existingSelection) {
      return res.status(400).json({
        error: "Selections with the same userId already exists",
      });
    }

    // Insert into the collection
    const insertSelection = await selectCollection.insertOne({
      userId,
      fullName,
      sector,
      agree,
    });

    //get the data
    const insertedData = await selectCollection.findOne({
      userId,
    });

    res.status(200).json({
      message: "Selection created successfully",
      insertedData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Patch
const selectionUpdateSchema = Joi.object({
  fullName: Joi.string().min(3).max(30),
  sector: Joi.string().min(3).max(30),
  agree: Joi.boolean(),
});

userSelection.patch("/:userId", async (req, res) => {
  try {
    const { error } = selectionUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { fullName, sector, agree } = req.body;
    const userId = req.params.userId;
    console.log(userId);

    //  get the collection
    const selectCollection = await getSelectCollection();

    // Update the document
    const updateSelection = await selectCollection.updateOne(
      { userId: userId },
      {
        $set: {
          fullName,
          sector,
          agree,
        },
      }
    );

    // Check if the document was found and updated
    if (updateSelection.modifiedCount === 0) {
      return res.status(404).json({ error: "Selection not found for user" });
    }

    // Get the updated document
    const updatedDocument = await selectCollection.findOne({
      userId,
    });

    res.status(200).json({
      message: "Selection updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating selection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get userSelection
userSelection.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Call the function to get the collection
    const selectCollection = await getSelectCollection();

    // Retrieve all selections
    const selections = await selectCollection.find({ userId }).toArray();

    res.status(200).json({
      message: "User selections retrieved successfully",
      data: selections,
    });
  } catch (error) {
    console.error("Error retrieving user selections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = userSelection;
