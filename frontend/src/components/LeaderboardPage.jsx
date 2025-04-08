// src/components/LeaderboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/leaderboard.css";

const decipherPseudonym = (encoded) => {
  try {
    return atob(encoded);
  } catch {
    return "Unknown";
  }
};

const LeaderboardPage = ({ goToWelcome }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/answers`)
      .then((res) => {
        const filtered = res.data
          .filter(entry => entry.useName && entry.pseudonym && entry.finalScore != null)
          .map(entry => ({
            name: decipherPseudonym(entry.pseudonym),
            score: entry.finalScore
          }))
          .sort((a, b) => b.score - a.score); // Sort by score descending

        setLeaderboardData(filtered);
      })
      .catch(err => console.error("Error loading leaderboard data:", err));
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="leaderboard-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="leaderboard-header-container">
          <h2>Leaderboard</h2>
          <button className="leaderboard-reset" onClick={goToWelcome}>
            Go to Main Page
          </button>
        </div>
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Adventurer Name</th>
                <th>AQ Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaderboardPage;