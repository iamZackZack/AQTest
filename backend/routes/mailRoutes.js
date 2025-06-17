const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { execSync } = require("child_process");
const Answer = require("../models/Answer");

router.post("/", async (req, res) => {
  const { pseudonym, email } = req.body;

  console.log("/api/mail called with:");
  console.log("   → Pseudonym:", pseudonym);
  console.log("   → Email to send to:", email);

  if (!pseudonym || !email) {
    console.warn("Missing pseudonym or email in request body.");
    return res.status(400).json({ message: "Missing pseudonym or email" });
  }

  try {
    // 🔍 Lookup player by pseudonym only
    const player = await Answer.findOne({ pseudonym });
    

    if (!player) {
      console.warn("❌ No matching player found for pseudonym:", pseudonym);
      return res.status(404).json({ message: "Player not found" });
    }

    const finalScore = player.finalScore;
    const abstractionLvl = player.abstractionLevel;
    const facetScores = [
      player.facetScores.RA ?? 0,
      player.facetScores.PR ?? 0,
      player.facetScores.G ?? 0,
      player.facetScores.R ?? 0,
      player.facetScores.LC ?? 0
    ];

    console.log("✅ Found player data.");
    console.log("   → Score:", finalScore);
    console.log("   → Level:", abstractionLvl);
    console.log("   → Facets:", facetScores);


    // 🧠 Generate the report
    const args = [finalScore, abstractionLvl, ...facetScores].join(" ");
    console.log("📄 Generating report with args:", args);
    execSync(`python3 reports/generate_report.py ${args}`, { stdio: "inherit" });

    console.log("✅ Report PDF generated.");

    // ✉️ Email it
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

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

    console.log("📤 Sending report to:", email);
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully.");
    res.status(200).json({ message: "Report sent!" });

  } catch (err) {
    console.error("🔥 Error sending report:", err);
    res.status(500).json({ message: "Failed to send report." });
  }
});

module.exports = router;