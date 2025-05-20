import React, { useEffect, useState } from "react";
import "../styles/rain.css";

const RainEffect = ({ duration = 2000, onComplete }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive(false);
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onComplete]);

  if (!active) return null;

  return (
    <div className="rain-overlay">
        {Array.from({ length: 100 }).map((_, i) => (
        <div
            key={i}
            className="raindrop"
            style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${1 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 1.5}s`
            }}
        />
        ))}    
    </div>
  );
};

export default RainEffect;