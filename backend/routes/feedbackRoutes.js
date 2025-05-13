const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/", async (req, res) => {
  const { feedback, timestamp } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: "Feedback is required" });
  }

  try {
    const newFeedback = new Feedback({
      feedback,
      timestamp: timestamp || new Date().toISOString(),
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback saved!" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;