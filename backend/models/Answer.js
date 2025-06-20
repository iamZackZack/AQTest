// This is the Schema for the Answers that are sent and stored in MongoDB. It essentially contains all the necessary 
// fields(keys) and the value types.

const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answers: Object,          // raw answers
  correctedRow: [Number],   // array of ints sent to R
  finalScore: Number,       // percentage
  abstractionLevel: Number,
  pseudonym: String,
  useName: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
  demographics: {
    university: String,
    degree: String,
    level: String,
    subjectField: String,
    rating: Number,
    educationYears: Number,
    gpa: Number,
    gender: String,
    age: Number,
    languageSkill: String
  },
  facetScores: {
    RA: Number,
    PR: Number,
    G: Number,
    R: Number,
    LC: Number
  }
});

module.exports = mongoose.model("Answer", AnswerSchema);