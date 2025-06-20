import React from "react";
import "./styles/hex-grid.css";

// Renders a clickable hexagonal grid question.
// The user selects one hex cell, optionally marked with a "start" image.
const HexGridQuestion = ({ question, userAnswers, setUserAnswers }) => {
  const gridSize = question.hexSize || 7;
  const start = question.hexStartPosition;

  // Handles cell selection (only one allowed at a time)
  const handleClick = (cellId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [question._id]: [cellId],
    }));
  };

  // Constants for hex dimensions
  const HEX_WIDTH = 60;
  const HEX_HEIGHT = Math.sqrt(3) / 2 * HEX_WIDTH;

  // Renders the entire hexagonal grid as absolutely positioned hex cells
  const renderGrid = () => {
    const cells = [];
  
    // Iterate over rows and columns to create hex cells
    for (let r = 0; r < gridSize + 1; r++) {
      for (let c = 0; c < gridSize + 2; c++) {
        const id = `${String.fromCharCode(65 + r)}${c + 1}`;
        const isStart = id === start;
        const isSelected = userAnswers[question._id]?.includes(id);
        const colorClass = ["color-a"][(r + c) % 1];
  
        // Calculate hex cell position (offset for every other column to create staggered rows)
        const x = c * (HEX_WIDTH * 0.75);
        const y = r * HEX_HEIGHT + (c % 2 === 1 ? HEX_HEIGHT / 2 : 0);
  
        cells.push(
          <div
            key={id}
            className="hex-cell"
            style={{ left: `${x}px`, top: `${y}px` }}
            onClick={() => handleClick(id)}
          >
            <div className={`hex-cell-content ${colorClass} ${isSelected ? "selected" : ""}`}>
              {isStart && question.startImage && (
                <img
                  src={question.startImage}
                  alt="Start"
                  className="hex-icon"
                />
              )}
            </div>
          </div>
        );
      }
    }
  
    return cells;
  };
  return (
    <div className="hex-grid-outer">
      <div className="hex-grid-wrapper">
        {renderGrid()}
      </div>
    </div>
  );
};

export default HexGridQuestion;