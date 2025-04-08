import React from "react";
import "./styles/either-or.css";

const EitherOrQuestion = ({ question, userAnswers, setUserAnswers }) => {
  const questionId = question._id;
  const eitherOrItems = question.options[0].items;
  const selectedAnswers = userAnswers[questionId] || {};

  const handleSelect = (itemText, choice) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [itemText]: choice,
      },
    }));
  };

  return (
    <div className="either-or-container">
      {eitherOrItems.map((item, index) => (
        <div key={index} className="either-or-item">
          <p className="either-or-text">{item.itemText}</p>

          <div className="either-or-choices">
            <button
              className={`either-or-button ${
                selectedAnswers[item.itemText] === (item.choiceAImage || item.choiceA)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleSelect(item.itemText, item.choiceAImage || item.choiceA)}
            >
              {item.choiceAImage ? (
                <img
                  src={item.choiceAImage}
                  alt="Choice A"
                  className="either-or-choice-image"
                />
              ) : (
                item.choiceA
              )}
            </button>

            <button
              className={`either-or-button ${
                selectedAnswers[item.itemText] === (item.choiceBImage || item.choiceB)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleSelect(item.itemText, item.choiceBImage || item.choiceB)}
            >
              {item.choiceBImage ? (
                <img
                  src={item.choiceBImage}
                  alt="Choice B"
                  className="either-or-choice-image"
                />
              ) : (
                item.choiceB
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EitherOrQuestion;