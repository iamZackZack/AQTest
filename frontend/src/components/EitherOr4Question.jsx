import React from "react";
import "./styles/either-or-4.css";

const EitherOr4Question = ({ question, userAnswers, setUserAnswers }) => {
  const questionId = question._id;
  const items = question?.options?.[0]?.items || [];
  const selectedAnswers = userAnswers[questionId] || {};

  const handleSelect = (itemText, choiceValue) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [itemText]: choiceValue,
      },
    }));
  };

  return (
    <div className="eo4-container">
      {items.map((item, idx) => {
        const choices = ["A", "B", "C", "D"]
          .map((k) => {
            const text = item[`choice${k}`];
            const image = item[`choice${k}Image`];
            if (text || image) {
              return {
                key: k,
                value: image || text,
                text,
                image,
              };
            }
            return null;
          })
          .filter(Boolean);

        return (
          <div className="eo4-item" key={idx}>
            <p className="eo4-text">{item.itemText}</p>

            <div className="eo4-choices" role="group" aria-label={item.itemText}>
              {choices.map((c) => {
                const isSelected = selectedAnswers[item.itemText] === c.value;
                return (
                  <button
                    key={c.key}
                    type="button"
                    className={`eo4-button ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(item.itemText, c.value)}
                    aria-pressed={isSelected}
                    aria-label={`Choice ${c.key}`}
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={`Choice ${c.key}`}
                        className="eo4-choice-image"
                      />
                    ) : (
                      <span className="eo4-choice-text">{c.text}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EitherOr4Question;