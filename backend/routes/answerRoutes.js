const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Answer = require("../models/Answer");

// Save new answer
router.post("/", async (req, res) => {
  const answer = new Answer(req.body);
  try {
    const savedAnswer = await answer.save();
    res.status(201).json(savedAnswer);
  } catch (err) {
    console.error("❌ Error saving answer:", err);
    res.status(400).json({ message: err.message });
  }
});

// Fetch all answers needed for leaderboard
router.get("/", async (req, res) => {
  try {
    const answers = await Answer.find();
    res.status(200).json(answers);
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    res.status(500).json({ message: err.message });
  }
});

// Updating Player Leaderboard Display Consent
router.patch("/consent", async (req, res) => {
  const { pseudonym, useName } = req.body;
  console.log("PATCH /consent called with:", { pseudonym, useName });

  try {
    const result = await Answer.findOneAndUpdate(
      { pseudonym },
      { useName },
      { new: true }
    );

    if (!result) {
      console.warn("No entry found for pseudonym:", pseudonym);
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Consent updated", useName: result.useName });
  } catch (err) {
    console.error("Error updating consent:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;