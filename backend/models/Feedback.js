const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);