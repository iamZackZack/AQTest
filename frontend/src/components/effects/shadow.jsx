import React, { useEffect, useState } from "react";
import "../styles/shadow.css";

const PterodactylShadow = ({ duration = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className="pterodactyl-shadow"></div>;
};

export default PterodactylShadow;