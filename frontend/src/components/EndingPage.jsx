import React, { useState, useEffect } from "react";
import "./styles/ending-page.css";
import { motion, AnimatePresence } from "framer-motion";
import endingTranslations from "../translations/endingTranslations";

const EndingPage = ({
  result,
  userData,
  setUserData,
  onSubmitFinalForm,
  language,
  shareLink = "https://abstract-test.com",
  goToWelcome
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [initialEmail, setInitialEmail] = useState(userData.email || "");
  const t = endingTranslations[language];

  useEffect(() => {
    setInitialEmail(userData.email);
  }, []);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value !== initialEmail) {
      setEmailSent(false);
    }
  };

  const handleSendResults = async () => {
    if (!isValidEmail(userData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudonym: btoa(userData.pseudonym.trim()), // this is the ID
          email: userData.email                        // this is where to send
        })
      });      
      setEmailSent(true);
      setInitialEmail(userData.email);
    } catch (err) {
      console.error("Error sending results email:", err);
    }
  };

  const handleSendFeedback = async () => {
    try {
      const payload = {
        feedback: userData.feedback,
        timestamp: new Date().toISOString(),
      };
  
      await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      setFeedbackSent(true);
    } catch (err) {
      console.error("Error sending feedback:", err);
    }
  };

  useEffect(() => {
    if (userData.rankConsent === null) {
      setUserData((prev) => ({ ...prev, rankConsent: true }));
    }
  }, [userData.rankConsent]);

  const updateConsent = async (value) => {
    if (!userData.pseudonym || userData.pseudonym.trim() === "") {
      console.error("❌ Cannot update consent — pseudonym is empty.");
      return;
    }

    const pseudonym = btoa(userData.pseudonym.trim());

    setUserData((prev) => ({ ...prev, rankConsent: value }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/answers/consent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonym, useName: value })
      });

      const result = await response.json();
      if (!response.ok) {
        console.warn("Consent update failed:", result.message);
      }
    } catch (err) {
      console.error("Failed to update leaderboard consent:", err);
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="ending-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2>{t.congrats}</h2>
        <p className="center-text">{t.message}</p>
        <br />

        <h3 className="center-text">{t.scoreTitle}</h3>
        <div className="aq-score">{result}</div>

        <label><strong>{t.emailPrompt}</strong></label>
        <div className="email-input-row">
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          <button
            className="email-button"
            onClick={handleSendResults}
            disabled={emailSent || !isValidEmail(userData.email)}
          >
            {t.sendResults}
          </button>
        </div>
        {emailSent && <p className="sent-message">{t.sentConfirmation}</p>}

        <label><strong>{t.leaderboardPrompt(userData.pseudonym)}</strong></label>
        <div className="button-toggle">
          <button
            className={`leaderboard-button ${userData.rankConsent === true ? "active" : ""}`}
            onClick={() => updateConsent(true)}
          >
            {t.yes}
          </button>
          <button
            className={`leaderboard-button ${userData.rankConsent === false ? "active" : ""}`}
            onClick={() => updateConsent(false)}
          >
            {t.no}
          </button>        
        </div>

        <div className="feedback-section">
          <label><strong>{t.feedbackPrompt}</strong></label>
          <textarea
            name="feedback"
            value={userData.feedback}
            onChange={handleChange}
            rows="4"
            disabled={feedbackSent}
          ></textarea>
          {feedbackSent && <p className="sent-message">{t.feedbackSent}</p>}
          <div className="feedback-button-wrapper">
            <button
              className="feedback-button"
              onClick={handleSendFeedback}
              disabled={feedbackSent || !userData.feedback.trim()}
            >
              {t.sendFeedback}
            </button>
          </div>
        </div>
        
        <div className="challenge-container">
          <h3 style={{ marginTop: "25px", marginBottom: "10px" }}>{t.challengeFriends}</h3>
          <img src="/images/QRCode.png" alt="QR Code" style={{ width: "200px" }} />
          <p><a href={shareLink} style={{ marginBottom: "15px" }}>{shareLink.replace("https://", "")}</a></p>
        </div>

        <div className="button-container">
          <button
            className="prev-button"
            onClick={goToWelcome}
          >
            {t.mainPage}
          </button>
          <button
            className="next-button"
            onClick={onSubmitFinalForm}
            disabled={userData.rankConsent !== true}
          >
            {t.leaderboard}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EndingPage;
