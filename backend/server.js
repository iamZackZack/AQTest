require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://aq-frontend.onrender.com",
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Import Routes
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const mailRoutes = require("./routes/mailRoutes");
const scoreRoutes = require("./routes/scoreRoute");

// Use Routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/score", scoreRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Define port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

