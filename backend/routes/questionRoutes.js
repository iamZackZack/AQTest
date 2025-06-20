const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/Question");
const router = express.Router();

// Route to fetch english questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add english questions (unused)
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
