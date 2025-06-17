const express = require("express");
const mongoose = require("mongoose");
const QuestionDE = require("../models/QuestionDe"); // This is the only change
const router = express.Router();

// Fetch German Questions
router.get("/", async (req, res) => {
  try {
    const questions = await QuestionDE.find().sort({ order: 1 });
    res.json(questions);
  } catch (err) {
    // console.error("❌ Error fetching German questions from DB:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add New German Question
router.post("/", async (req, res) => {
  const question = new QuestionDE(req.body);
  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;