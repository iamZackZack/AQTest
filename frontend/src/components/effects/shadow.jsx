import React, { useEffect, useState } from "react";
import "../styles/shadow.css";

// Displays a flying pterodactyl shadow animation for a fixed duration (default: 2000ms).
// Automatically hides the animation after the duration expires.
const PterodactylShadow = ({ duration = 2000 }) => {
  const [visible, setVisible] = useState(true);

  // Hide the shadow after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);  // Cleanup timer on unmount or duration change
  }, [duration]);

  if (!visible) return null;

  // Render the shadow overlay element
  return <div className="pterodactyl-shadow"></div>;
};

export default PterodactylShadow;