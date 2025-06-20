// This is the Schema for the Questions in German that are retrieved from MongoDB. It essentially contains all the necessary 
// fields(keys) and the value types. They are practically the same as the Question.js schema.

const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  flavorText: { type: String },
  options: [
    {
      type: {
        type: String,
        enum: [
          "text", "image", "grid", "triangle-grid", "drag-order", "either-or", "drag-group"
        ],
        required: function () {
          return this.type !== "text-entry";
        }
      },
      value: {
        type: String,
        required: function () {
          return this.type !== "either-or" && this.type !== "text-entry" && this.type !== "drag-group";
        }
      },
      items: [
        {
          itemText: { type: String, required: function () { return this.type === "either-or"; } },
          choiceA: { type: String },
          choiceB: { type: String },
          choiceAImage: { type: String },
          choiceBImage: { type: String }
        }
      ]
    }
  ],
  gridSize: { type: Number, enum: [5, 7], required: function () { return this.type === "grid"; } },
  triangleGridRows: { type: Number, required: function () { return this.type === "triangle-grid"; } },
  startPosition: { type: String, required: function () { return this.type === "grid" || this.type === "triangle-grid"; } },
  startImage: { type: String, required: function () { return this.type === "grid" || this.type === "triangle-grid"; } },
  qImage: {
    type: String,
    required: function () {
      return [
        "single-multiple-choice", "multiple-multiple-choice", "drag-order", "grid", "triangle-grid", "hex-grid"
      ].includes(this.type);
    }
  },
  qImageWidth: { type: Number },
  qImageHeight: { type: Number },
  correctAnswer: {
    type: [mongoose.Schema.Types.Mixed],
    required: function () {
      return [
        "text-entry", "drag-group", "either-or", "grid", "triangle-grid", "drag-order",
        "single-multiple-choice", "multiple-multiple-choice", "hex-grid"
      ].includes(this.type);
    },
    default: []
  },
  type: {
    type: String,
    enum: [
      "single-multiple-choice", "multiple-multiple-choice", "grid", "triangle-grid",
      "drag-group", "drag-order", "either-or", "text-entry", "hex-grid"
    ],
    required: true
  },
  hexStartPosition: {
    type: String,
    required: function () {
      return this.type === "hex-grid";
    }
  },
  hexSize: {
    type: Number,
    default: 7
  },
  answersNeeded: { type: Number },
  order: {type: Number, required: true},
  hardness: {type: Number, required: true}
});

// 👇 force the collection name to be 'questions_de'
module.exports = mongoose.model("QuestionDe", QuestionSchema, "questions_de");