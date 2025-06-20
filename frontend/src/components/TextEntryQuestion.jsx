import React from "react";
import "./styles/text-entry.css";

// Component for handling a single-word open text input question.
// Captures user input, lowercases it, trims whitespace, and stores it in state.
const TextEntryQuestion = ({ question, textEntryAnswers, setTextEntryAnswers }) => {
  const questionId = question._id;
  const inputValue = textEntryAnswers[questionId] || "";

  // Called whenever the input changes
  const handleChange = (e) => {
    setTextEntryAnswers((prev) => ({
      ...prev,
      [questionId]: e.target.value.toLowerCase().trim(),  // Normalize input: lowercase + trim
    }));
  };

  return (
    <div className="text-entry-container">
      <input
        type="text"
        className="text-entry-input"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type your answer here"
      />
    </div>
  );
};

export default TextEntryQuestion;