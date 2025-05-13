const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Missing email" });

  // Set up your transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use another provider like SendGrid
    auth: {
      user: process.env.MAIL_USER, // Your Gmail or SMTP user
      pass: process.env.MAIL_PASS  // App password (not your Gmail login)
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your Abstraction Test Results",
    text: "Thank you for taking the Abstraction Test!\n\nThis is a test email just to confirm we can send messages."
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;