import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/welcome-page.css";
import welcomeTranslations from "../translations/welcomeTranslations";

// The WelcomePage serves as the landing screen for the app.
// - Lets users select a language (English/German)
// - Displays introductory guidelines and game context
// - Provides navigation to either the leaderboard or the story intro
const WelcomePage = ({ language, setLanguage, onContinue, toLeaderboard }) => {
  const t = welcomeTranslations[language];  // Translation object for the current language

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
        
        {/* Title */}
        <h1>{t.title}</h1>

        {/* Language switch prompt and buttons */}
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

        {/* Introductory description */}
        <p>{t.intro}</p>

        {/* Guidelines list */}
        <ul className="guidelines">
          {t.guidelines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        {/* Narrative setup */}
        <p>{t.storyline}</p>

        {/* Navigation buttons */}
        <div className="button-container">
          <button className="welcome-prev-button" onClick={toLeaderboard}>
            {t.leaderboard}
          </button>
          <button className="welcome-next-button" onClick={onContinue}>
            {t.continue}
          </button>
        </div>

        {/* Footer notes */}
        <p className="footer-note"><strong>{t.devNote}</strong></p>
        <p className="footer-note">{t.issues}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePage;