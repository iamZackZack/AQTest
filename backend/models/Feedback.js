// This is the Schema for the Feedbacks that are sent and stored in MongoDB. It essentially contains all the necessary 
// fields(keys) and the value types.

const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);