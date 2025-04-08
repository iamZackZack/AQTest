import React from "react";
import "./styles/grid.css";

const GridQuestion = ({ question, userAnswers, setUserAnswers }) => {
  const gridSize = Number(question.gridSize) || 5;
  const rows = [..."ABCDEFG"].slice(0, gridSize);
  const cols = Array.from({ length: gridSize }, (_, i) => i + 1);
  const startPosition = question.startPosition || null;
  const startImage = question.startImage || "/images/dino.png";
  const questionId = question._id;

  const handleClick = (cell) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [cell],
    }));
  };

  return (
    <div className="grid-container">
      {rows.map((row) => (
        <div key={row} className="grid-row">
          {cols.map((col) => {
            const cell = `${row}${col}`;
            const isSelected = userAnswers[questionId]?.includes(cell);
            const isStart = cell === startPosition;
            return (
              <div
                key={cell}
                className={`grid-cell ${isSelected ? "selected" : ""}`}
                onClick={() => handleClick(cell)}
              >
                {isStart && (
                  <img
                    src={startImage}
                    alt="Start Position"
                    className="grid-start-image"
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

export default GridQuestion;