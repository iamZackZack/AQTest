const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get All Questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
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
