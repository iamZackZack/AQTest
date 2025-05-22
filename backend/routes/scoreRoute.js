const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Read dX.csv headers once at startup
const dXPath = path.join(__dirname, "..", "dX.csv");
let dXHeaders = null;

try {
  dXHeaders = fs.readFileSync(dXPath, "utf8").split("\n")[0].trim();
  console.log("✅ Loaded dX.csv headers:", dXHeaders);
} catch (err) {
  console.error("❌ Failed to read dX.csv:", err);
}

router.post("/", (req, res) => {
  const { response } = req.body;

  if (!Array.isArray(response)) {
    console.warn("⚠️ Invalid response format received:", response);
    return res.status(400).json({ error: "Invalid response format" });
  }

  console.log("📝 Received score row:", response);

  // Save new response to CSV
  const csvPath = path.join(__dirname, "..", "new_response.csv");
  const fullCsvContent = dXHeaders + "\n" + response.join(",") + "\n";

  try {
    fs.writeFileSync(csvPath, fullCsvContent);
    console.log("✅ Wrote new_response.csv");
  } catch (err) {
    console.error("❌ Failed to write new_response.csv:", err);
    return res.status(500).json({ error: "Failed to write CSV file" });
  }

  // Run R script
  console.log("🚀 Running R script...");

  console.log("📁 Current working directory:", path.join(__dirname, ".."));
  console.log("🔍 Checking if R script exists:", fs.existsSync(path.join(__dirname, "..", "score_player.R")));

  const rScriptPath = path.join(__dirname, "..", "score_player.R");
  if (!fs.existsSync(rScriptPath)) {
    console.error("❌ score_player.R NOT FOUND at:", rScriptPath);
    return res.status(500).json({ error: "R script missing on server" });
  } else {
    console.log("✅ Found score_player.R at:", rScriptPath);
  }

  const r = spawn("Rscript", ["score_player.R"], {
    cwd: path.join(__dirname, ".."),
  });

  let output = "";
  r.stdout.on("data", (data) => {
    output += data.toString();
    console.log("📤 R output:", data.toString());
  });

  r.stderr.on("data", (data) => {
    console.error("❗ R script stderr:", data.toString());
  });

  r.on("close", (code) => {
    console.log(`📦 R script exited with code ${code}`);
    console.log("📤 R output:", output);

    try {
      const result = JSON.parse(output);  // ✅ PARSE JSON FROM R
      if (typeof result.percent === "number" && typeof result.logit === "number") {
        res.json({ score: result.percent, logit: result.logit });
      } else {
        throw new Error("Invalid JSON structure");
      }
    } catch (err) {
      console.error("❌ Failed to parse JSON from R output:", err);
      res.status(500).json({ error: "Could not parse R output as JSON" });
    }
  });
});

module.exports = router;