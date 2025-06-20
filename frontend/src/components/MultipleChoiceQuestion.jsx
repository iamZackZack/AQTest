import React from "react";
import "./styles//multiple-choice.css";

const MultipleChoiceQuestion = ({
  question,
  userAnswers,
  setUserAnswers,
  setSelectedAnswers,
  shuffledOptions,
  getGridClass,
}) => {
  const questionId = question._id;

  // Handles a user's selection or deselection of an option
  const handleClick = (optionValue) => {
    const isMulti = question.type === "multiple-multiple-choice";

    // Update stored answers
    setUserAnswers((prev) => {
      const prevAnswers = prev[questionId] || [];

      // Toggle selection if multi, otherwise override
      const newAnswers = isMulti
        ? prevAnswers.includes(optionValue)
          ? prevAnswers.filter((ans) => ans !== optionValue)
          : [...prevAnswers, optionValue]
        : [optionValue];

      return { ...prev, [questionId]: newAnswers };
    });

    // Also update visual state (if separate from userAnswers)
    setSelectedAnswers((prevSelected) => {
      return isMulti
        ? prevSelected.includes(optionValue)
          ? prevSelected.filter((ans) => ans !== optionValue)
          : [...prevSelected, optionValue]
        : [optionValue];
    });
  };

  return (
    <ul className={`options ${getGridClass(shuffledOptions.length)}`}>
      {shuffledOptions.map((option, index) => {
        const isSelected = userAnswers[questionId]?.includes(option.value);

        return (
          <li
            key={index}
            onClick={() => handleClick(option.value)}
            className={`option ${isSelected ? "selected" : ""}`}
          >
            {/* Render image if option is an image, fallback to text otherwise */}
            {option.type === "image" ? (
              <img
                src={option.value}
                alt="Option"
                className="option-image"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.src = "/images/default-placeholder.png";
                }}
              />
            ) : (
              option.value
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MultipleChoiceQuestion;