const express = require("express");
const mongoose = require("mongoose");
const QuestionDE = require("../models/QuestionDe");
const router = express.Router();

// Route to fetch german questions
router.get("/", async (req, res) => {
  try {
    const questions = await QuestionDE.find().sort({ order: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add german questions (unused)
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