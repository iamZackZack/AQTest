import React, { useState } from "react";
import "./styles/demographics-page.css";
import demographicsTranslations from "../translations/demographicsTranslations";
import { motion, AnimatePresence } from "framer-motion";

const DemographicsPage = ({ userData, setUserData, onNext, language }) => {
  const [university, setUniversity] = useState("");
  const [otherUni, setOtherUni] = useState("");
  const [rating, setRating] = useState(userData.rating || null);
  const [errors, setErrors] = useState({});
  const t = demographicsTranslations[language];

  const validateField = (name, value) => {
    const num = Number(value);
    if (name === "educationYears" && (num < 1 || num > 10)) return t.errors.educationYears;
    if (name === "gpa" && (num < 1 || num > 100)) return t.errors.gpa;
    if (name === "age" && (num < 10 || num > 99)) return t.errors.age;
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleUniversityChange = (e) => {
    const value = e.target.value;
    setUniversity(value);
    setUserData((prev) => ({ ...prev, university: value === "Other" ? otherUni : value }));
  };

  const handleRatingClick = (val) => {
    setRating(val);
    setUserData((prev) => ({ ...prev, rating: val }));
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="demographics-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="loading-section">
          <img src="/images/gears.gif" alt="Loading..." style={{ width: "120px", height: "60px" }} />
          <p>{t.loading}</p>
        </div>

        <label>{t.university}</label>
        <select value={university} onChange={handleUniversityChange}>
          <option value="">--Select--</option>
          <option value="TUM">TUM</option>
          <option value="LMU">LMU</option>
          <option value="Other">{t.subjects[8]}</option>
        </select>
        {university === "Other" && (
          <input
            type="text"
            placeholder={t.otherUniversity}
            value={otherUni}
            onChange={(e) => {
              setOtherUni(e.target.value);
              setUserData((prev) => ({ ...prev, university: e.target.value }));
            }}
          />
        )}

        <label>{t.degree}</label>
        <input type="text" name="degree" value={userData.degree || ""} onChange={handleChange} />

        <label>{t.level}</label>
        <select name="level" value={userData.level || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          {t.levels.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>

        <label>{t.subject}</label>
        <select name="subjectField" value={userData.subjectField || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          {t.subjects.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>

        <label>{t.rating}</label>
        <div className="star-rating">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className={`star ${rating >= i + 1 ? "selected" : ""}`}
              onClick={() => handleRatingClick(i + 1)}
            >★</span>
          ))}
        </div>

        <label>{t.years}</label>
        <input
          type="text"
          name="educationYears"
          value={userData.educationYears || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) handleChange(e);
          }}
        />
        {errors.educationYears && <p className="error-message">{errors.educationYears}</p>}

        <label>{t.gpa}</label>
        <input
          type="text"
          name="gpa"
          value={userData.gpa || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) handleChange(e);
          }}
        />
        {errors.gpa && <p className="error-message">{errors.gpa}</p>}

        <label>{t.gender}</label>
        <select name="gender" value={userData.gender || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          {t.genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <label>{t.age}</label>
        <input
          type="text"
          name="age"
          value={userData.age || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) handleChange(e);
          }}
        />
        {errors.age && <p className="error-message">{errors.age}</p>}

        <label>{t.language}</label>
        <select name="languageSkill" value={userData.languageSkill || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>

        <div className="button-container right-align">
          <button onClick={onNext}>{t.continue}</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemographicsPage;