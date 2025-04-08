require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/AQTestDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");

// Use Routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Define port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

