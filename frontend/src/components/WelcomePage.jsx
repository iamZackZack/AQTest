import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/welcome-page.css";

const WelcomePage = ({ language, setLanguage, onContinue, toLeaderboard }) => {
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="intro-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
          <h1>Welcome to the <span className="highlight-title">Abstraction Test</span>!</h1>

          <p>
            Please select the <span className="highlight">language</span> you are most proficient at below.
          </p>

          <div className="language-button-group">
            <button
              onClick={() => setLanguage("en")}
              className={`language-button ${language === "en" ? "active" : ""}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("de")}
              className={`language-button ${language === "de" ? "active" : ""}`}
            >
              Deutsch
            </button>
          </div>

          <p>
            The following set of puzzles were designed to measure your{" "}
            <span className="highlight-purple">Abstraction Quotient</span> (AQ). To achieve the best measurement possible, please take the test under ideal conditions:
          </p>

          <ul className="guidelines">
            <li>The test takes approx. <strong>30min</strong> to complete. Ensure enough time to finish the full test.</li>
            <li>The test is best displayed on a <strong><u>larger screen</u></strong>. Avoid mobile if possible.</li>
            <li>We recommend taking the test in an <strong><u>undisrupted</u></strong> environment.</li>
          </ul>

          <p>
            The test follows a storyline to make the experience more engaging. On the next page, you’ll be introduced to the story and the test instructions.
          </p>

          <div className="button-container">
            <button className="welcome-prev-button" onClick={toLeaderboard}>
              Go to Leaderboard
            </button>
            <button className="welcome-next-button" onClick={onContinue}>
              Continue →
            </button>
          </div>

          <p className="footer-note">
            <strong>Developer's Note: Not optimized for mobile!</strong>
          </p>

          <p className="footer-note">
            AT.V6 | Issues? Contact <a href="mailto:abstraction@cdtm.de">abstraction@cdtm.de</a>
          </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePage;