import React, { useEffect, useState } from "react";
import "../styles/insect.css";

const LadybugEffect = ({ duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className="ladybug-fly"></div>;
};

export default LadybugEffect;