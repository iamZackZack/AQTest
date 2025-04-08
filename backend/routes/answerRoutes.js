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

module.exports = router;