import React, { useEffect, useState } from "react";
import "../styles/insect.css";

// Displays a flying ladybug animation for a fixed duration.
// Automatically hides the animation after the specified time (default: 4000ms).
const LadybugEffect = ({ duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  // Set a timer to hide the animation after the duration ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);  // Cleanup on unmount or duration change
  }, [duration]);

  if (!visible) return null;

  // Render ladybug animation container
  return <div className="ladybug-fly"></div>;
};

export default LadybugEffect;