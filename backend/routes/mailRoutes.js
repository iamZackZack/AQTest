const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const Answer = require("../models/Answer");

const execFileAsync = promisify(execFile);

// POST /api/mail
router.post("/", async (req, res) => {
  const { pseudonym, email } = req.body;

  if (!pseudonym || !email) {
    return res.status(400).json({ message: "Missing pseudonym or email" });
  }

  try {
    // 1) Look up results for this pseudonym
    const player = await Answer.findOne({ pseudonym }).lean();
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // 2) Extract scores safely
    const finalScore = player.finalScore ?? 0;
    const abstractionLvl = player.abstractionLevel ?? 0;
    const fscores = player.facetScores || {};
    const facetScores = [
      fscores.RA ?? 0,
      fscores.PR ?? 0,
      fscores.G  ?? 0,
      fscores.R  ?? 0,
      fscores.LC ?? 0,
    ];

    // 3) Unique output path (avoid collisions)
    const outName = `report-${crypto.randomUUID()}.pdf`;
    const outPath = path.join("/tmp", outName);

    // 4) Run Python to generate the PDF (async & safe)
    //    args: <score> <level> <RA> <PR> <G> <R> <LC> <out_path>
    const pyScript = path.join(process.cwd(), "reports", "generate_report.py");
    const args = [
      pyScript,
      String(finalScore),
      String(abstractionLvl),
      ...facetScores.map(String),
      outPath,
    ];

    await execFileAsync("python3", args, { cwd: process.cwd() });

    // 5) Send email with PDF attached
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // use an App Password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Abstraction Test Report",
      text: "Thank you for taking the Abstraction Test! Your personalized report is attached.",
      attachments: [
        {
          filename: "Abstraction_Report.pdf",
          path: outPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // 6) Clean up temp file
    try { await fs.unlink(outPath); } catch (_) {}

    return res.status(200).json({ message: "Report sent!" });
  } catch (err) {
    console.error("Mail route error:", err);
    return res.status(500).json({ message: "Failed to send report." });
  }
});

module.exports = router;
