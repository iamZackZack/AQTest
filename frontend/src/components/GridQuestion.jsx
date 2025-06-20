import React from "react";
import "./styles/grid.css";

// Renders a selectable grid question where the user selects one cell.
// Optionally displays a start icon (e.g., a dinosaur) in a specific cell.
const GridQuestion = ({ question, userAnswers, setUserAnswers }) => {
  // Determine grid size (default to 5 if not specified)
  const gridSize = Number(question.gridSize) || 5;

  // Generate row and column labels for the grid
  const rows = [..."ABCDEFG"].slice(0, gridSize);
  const cols = Array.from({ length: gridSize }, (_, i) => i + 1);

  // Optional: starting cell and image to visually indicate start
  const startPosition = question.startPosition || null;
  const startImage = question.startImage || "/images/dino.png";

  // Unique question ID used to index into user answers
  const questionId = question._id;

  // Handle cell click: allow only one selection at a time
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