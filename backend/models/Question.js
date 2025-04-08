const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  flavorText: { type: String },

  options: [
    {
      type: { type: String, enum: ["text", "image", "grid", "triangle-grid", "drag-order", "either-or", "drag-group"], required: function() { return this.type !== "text-entry"; } },
      value: { type: String, required: function() { return this.type !== "either-or" && this.type !== "text-entry" && this.type !== "drag-group"; } },
      items: [
        {
          itemText: { type: String, required: function() { return this.type === "either-or"; } },
          choiceA: { type: String, required: false },
          choiceB: { type: String, required: false },
          choiceAImage: { type: String, required: false }, // ✅ New: Optional Image for Choice A
          choiceBImage: { type: String, required: false }  // ✅ New: Optional Image for Choice B
        }
      ]
    }
  ],

  // ✅ Grid-Specific Fields
  gridSize: { type: Number, enum: [5, 7], required: function() { return this.type === "grid"; } },
  triangleGridRows: { type: Number, required: function() { return this.type === "triangle-grid"; } },
  startPosition: { 
    type: String, 
    required: function() { 
      return this.type === "grid" || this.type === "triangle-grid"; 
    } 
  },
  startImage: { 
    type: String, 
    required: function() { 
      return this.type === "grid" || this.type === "triangle-grid"; 
    } 
  },

  // ✅ qImage-Specific Field
  qImage: { 
    type: String, 
    required: function() { 
      return ["single-multiple-choice", "multiple-multiple-choice", "drag-order", "grid", "triangle-grid", "hex-grid"].includes(this.type); 
    } 
  },
  qImageWidth: { type: Number, required: false },
  qImageHeight: { type: Number, required: false },

  // ✅ Correct Answer (Array for different question types)
  correctAnswer: {
    type: [mongoose.Schema.Types.Mixed], // Accepts flat or nested arrays
    required: function () {
      return [
        "text-entry",
        "drag-group",
        "either-or",
        "grid",
        "triangle-grid",
        "drag-order",
        "single-multiple-choice",
        "multiple-multiple-choice",
        "hex-grid"
      ].includes(this.type);
    },
    default: []
  },

  // ✅ Question Type
  type: { 
    type: String, 
    enum: ["single-multiple-choice", "multiple-multiple-choice", "grid", "triangle-grid", "drag-group", "drag-order", "either-or", "text-entry", "hex-grid"], 
    required: true 
  },

  hexStartPosition: {
    type: String, // Example: "F4"
    required: function () {
      return this.type === "hex-grid";
    },
  },
  
  hexSize: {
    type: Number,
    default: 7, // for 7x7 grid
  },  

  // ✅ Answers Needed (For validation, optional)
  answersNeeded: { type: Number, required: false }
});

module.exports = mongoose.model("Question", QuestionSchema);