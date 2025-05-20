import React, { useEffect, useState } from "react";
import "../styles/wind.css";

const leafImages = [
  "/images/wind/wind1.png",
  "/images/wind/wind2.png",
  "/images/wind/wind3.png",
  "/images/wind/wind4.png",
  "/images/wind/wind5.png",
  "/images/wind/wind6.png",
];

const GustOfLeaves = ({ duration = 4000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!show) return null;

  return (
    <div className="gust-container">
      {Array.from({ length: 25 }).map((_, i) => {
        const randomImg = leafImages[i % leafImages.length];
        const delay = Math.random() * 1.5; // Slightly less delay
        const duration = 2.5 + Math.random() * 1.5; // Faster fall
        const size = 20 + Math.random() * 30;
        const rotate = 360 + Math.random() * 360;
        const startX = Math.random() * 100;
        const driftX = 60 + Math.random() * 80; // More horizontal drift

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