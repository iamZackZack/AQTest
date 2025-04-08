import React, { useState, useEffect } from "react";
import "./styles/ending-page.css";
import { motion, AnimatePresence } from "framer-motion";

const EndingPage = ({
  result,
  userData,
  setUserData,
  onSubmitFinalForm,
  shareLink = "https://abstract-test.com",
  goToWelcome
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [initialEmail, setInitialEmail] = useState(userData.email || "");

  useEffect(() => {
    setInitialEmail(userData.email);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value !== initialEmail) {
      setEmailSent(false);
    }
  };

  const handleSendResults = () => {
    setEmailSent(true); // No actual API call yet
    setInitialEmail(userData.email);
  };

  const handleSendFeedback = () => {
    setFeedbackSent(true); // No actual API call yet
  };

  // Default rankConsent to true if it hasn't been set yet
  useEffect(() => {
    if (userData.rankConsent === null) {
      setUserData((prev) => ({ ...prev, rankConsent: true }));
    }
  }, [userData.rankConsent]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="ending-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2>Congratulations!</h2>
        <p className="center-text">
          You have arranged your journal about the jurassic age and dinosaurs and completed the <span className="highlight-title">Abstraction Test</span>. Now onto the next adventure!
        </p>
        <br />

        <h3 className="center-text">Your Abstraction Quotient (AQ):</h3>
        <div className="aq-score">{result}</div>

        <label><strong>If you'd like to receive your full AQ report, please enter your E-mail:</strong></label>
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
            disabled={emailSent || !userData.email}
          >
            Send Results
          </button>
        </div>
        {emailSent && <p className="sent-message">Your results have been sent to your email.</p>}

        <label><strong>Do you want to appear on the leaderboard {userData.pseudonym}?</strong></label>
        <div className="button-toggle">
          <button
            className={`leaderboard-button ${userData.rankConsent === true ? "active" : ""}`}
            onClick={() => setUserData((prev) => ({ ...prev, rankConsent: true }))}
          >
            Yes
          </button>
          <button
            className={`leaderboard-button ${userData.rankConsent === false ? "active" : ""}`}
            onClick={() => setUserData((prev) => ({ ...prev, rankConsent: false }))}
          >
            No
          </button>
        </div>

        <div className="feedback-section">
          <label><strong>Do you want to leave us some feedback?</strong></label>
          <textarea
            name="feedback"
            value={userData.feedback}
            onChange={handleChange}
            rows="4"
            disabled={feedbackSent}
          ></textarea>
          <div className="feedback-button-wrapper">
            <button
              className="feedback-button"
              onClick={handleSendFeedback}
              disabled={feedbackSent || !userData.feedback.trim()}
            >
              Send Feedback
            </button>
          </div>
        </div>
        
        <div className="challenge-container">
          <h3 style={{ marginTop: "25px", marginBottom: "10px" }}>Challenge your friends!</h3>
          <img src="/images/QRCode.png" alt="QR Code" style={{ width: "200px" }} />
          <p><a href={shareLink} style={{ marginBottom: "15px" }}>{shareLink.replace("https://", "")}</a></p>
        </div>

        <div className="button-container">
          <button
            className="prev-button"
            onClick={goToWelcome}
          >
            Go to Main Page
          </button>
          <button
            className="next-button"
            onClick={onSubmitFinalForm}
            disabled={userData.rankConsent !== true}
          >
            Go to Leaderboard
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EndingPage;
