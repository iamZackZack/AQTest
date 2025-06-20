import React, { useEffect, useState } from "react";
import "../styles/wind.css";

// List of leaf image paths used in the gust animation
const leafImages = [
  "/images/wind/wind1.png",
  "/images/wind/wind2.png",
  "/images/wind/wind3.png",
  "/images/wind/wind4.png",
  "/images/wind/wind5.png",
  "/images/wind/wind6.png",
];

// Displays a gust of animated falling leaves for a limited time (default: 4000ms).
// Randomizes position, rotation, and animation for natural variation.
const GustOfLeaves = ({ duration = 4000 }) => {
  const [show, setShow] = useState(true);

  // Hide the gust effect after the given duration
  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!show) return null;

  // Render 25 leaf elements with randomized animation properties
  return (
    <div className="gust-container">
      {Array.from({ length: 25 }).map((_, i) => {
        const randomImg = leafImages[i % leafImages.length];
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 1.5;
        const size = 20 + Math.random() * 30;
        const rotate = 360 + Math.random() * 360;
        const startX = Math.random() * 100;
        const driftX = 60 + Math.random() * 80;

        return (
          <img
            key={i}
            src={randomImg}
            alt="leaf"
            className="leaf"
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              width: `${size}px`,
              transform: `rotate(${rotate}deg)`,
              left: `${startX}vw`,
              "--driftX": `${driftX}vw`,
              "--rotation": `${rotate}deg`,
            }}
          />
        );
      })}
    </div>
  );
};

export default GustOfLeaves;