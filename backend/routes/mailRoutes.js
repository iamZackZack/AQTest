const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { execSync } = require("child_process");
const Answer = require("../models/Answer");

// Route to generate and send a report via email
router.post("/", async (req, res) => {
  const { pseudonym, email } = req.body;

  // Validate request body
  if (!pseudonym || !email) {
    return res.status(400).json({ message: "Missing pseudonym or email" });
  }

  try {
    // Lookup player by pseudonym only
    const player = await Answer.findOne({ pseudonym });
    

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Extract necessary data from player object
    const finalScore = player.finalScore;
    const abstractionLvl = player.abstractionLevel;
    const facetScores = [
      player.facetScores.RA ?? 0,
      player.facetScores.PR ?? 0,
      player.facetScores.G ?? 0,
      player.facetScores.R ?? 0,
      player.facetScores.LC ?? 0
    ];

    // Run Python script to generate report with score arguments
    const args = [finalScore, abstractionLvl, ...facetScores].join(" ");
    execSync(`python3 reports/generate_report.py ${args}`, { stdio: "inherit" });

    // Set up email transport using Gmail credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // Define email content and attach the generated PDF report
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Abstraction Test Report",
      text: "Thank you for taking the Abstraction Test! Your personalized report is attached.",
      attachments: [
        {
          filename: "Abstraction_Report.pdf",
          path: "reports/final_report.pdf",
          contentType: "application/pdf"
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Report sent!" });

  } catch (err) {
    // Handle any errors during the process
    res.status(500).json({ message: "Failed to send report." });
  }
});

module.exports = router;