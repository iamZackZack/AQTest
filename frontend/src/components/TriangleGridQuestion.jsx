import React from "react";
import "./styles/triangle-grid.css";

// Renders a triangular grid layout question where the user selects a single cell.
// Displays directional labels and optionally an image at the start position.
const TriangleGridQuestion = ({ question, userAnswers, setUserAnswers }) => {
  const gridSize = Number(question.gridSize) || 7;

  // Generate grid rows: each cell has a label like A1, A2, ..., B1, B2, etc.
  const rows = Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`)
  );

  const questionId = question._id;
  const startPosition = question.startPosition || null;
  const startImage = question.startImage || "/images/dino.png";

  // Handle when a cell is clicked
  const handleClick = (cell) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [cell],
    }));
  };

  return (
    <div className="rotated-grid-wrapper">
      <div className="direction-label top-label">Up</div>
      <div className="rotated-grid-row-wrapper">
        <div className="direction-label left-label">Left</div>
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
        <div className="direction-label right-label">Right</div>
      </div>
      <div className="direction-label bottom-label">Down</div>
    </div>
  );
};

export default TriangleGridQuestion;