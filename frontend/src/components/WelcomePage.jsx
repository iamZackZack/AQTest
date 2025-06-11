import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/welcome-page.css";
import welcomeTranslations from "../translations/welcomeTranslations";

const WelcomePage = ({ language, setLanguage, onContinue, toLeaderboard }) => {
  const t = welcomeTranslations[language];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="intro-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={language} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1>{t.title}</h1>
        <p>{t.languagePrompt}</p>

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

        <p>{t.intro}</p>

        <ul className="guidelines">
          {t.guidelines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        <p>{t.storyline}</p>

        <div className="button-container">
          <button className="welcome-prev-button" onClick={toLeaderboard}>
            {t.leaderboard}
          </button>
          <button className="welcome-next-button" onClick={onContinue}>
            {t.continue}
          </button>
        </div>

        <p className="footer-note"><strong>{t.devNote}</strong></p>
        <p className="footer-note">{t.issues}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePage;