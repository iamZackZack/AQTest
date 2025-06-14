const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answers: Object,          // raw answers
  correctedRow: [Number],   // array of ints sent to R
  finalScore: Number,       // percentage
  logitScore: Number,       // logit score from R
  abstractionLevel: Number,
  pseudonym: String,
  useName: Boolean,
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