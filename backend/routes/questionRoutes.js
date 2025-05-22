const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/Question");
const router = express.Router();

// Get All Questions
router.get("/", async (req, res) => {
  console.log("📥 /api/questions hit");
  try {
    const questions = await Question.find();
    console.log("✅ DB returned:", questions);
    res.json(questions);
  } catch (err) {
    console.error("❌ Error fetching questions from DB:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add New Question
router.post("/", async (req, res) => {
  const question = new Question(req.body);
  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
