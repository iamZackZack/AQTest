import React from "react";
import "./styles/text-entry.css";

const TextEntryQuestion = ({ question, textEntryAnswers, setTextEntryAnswers }) => {
  const questionId = question._id;
  const inputValue = textEntryAnswers[questionId] || "";

  const handleChange = (e) => {
    setTextEntryAnswers((prev) => ({
      ...prev,
      [questionId]: e.target.value.toLowerCase().trim(),
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