import React from "react";
import "./styles/triangle-grid.css";

const TriangleGridQuestion = ({ question, userAnswers, setUserAnswers }) => {
  const gridSize = Number(question.gridSize) || 7;
  const rows = Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`)
  );
  const questionId = question._id;
  const startPosition = question.startPosition || null;
  const startImage = question.startImage || "/images/dino.png";

  const handleClick = (cell) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [cell],
    }));
  };

  return (
    <div className="rotated-grid-container">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="rotated-grid-row">
          {row.map((cell) => {
            const isSelected = userAnswers[questionId]?.includes(cell);
            const isStart = cell === startPosition;

            return (
              <div
                key={cell}
                className={`rotated-grid-cell ${isSelected ? "selected" : ""}`}
                onClick={() => handleClick(cell)}
              >
                {isStart && (
                  <img
                    src={startImage}
                    alt="Start Position"
                    className="rotated-grid-start-image"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TriangleGridQuestion;