// models/Answer.js
const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answers: Object,
  finalScore: Number,
  pseudonym: String,
  useName: Boolean,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Answer", AnswerSchema);