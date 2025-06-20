import React from "react";
import { motion } from "framer-motion";

// PageWrapper provides a smooth animated transition when mounting/unmounting pages
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      className="book"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="page">{children}</div>
    </motion.div>
  );
};

export default PageWrapper;