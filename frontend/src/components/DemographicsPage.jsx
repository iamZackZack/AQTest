import React, { useState } from "react";
import "./styles/demographics-page.css";

const DemographicsPage = ({ userData, setUserData, onNext }) => {
  const [university, setUniversity] = useState("");
  const [otherUni, setOtherUni] = useState("");
  const [rating, setRating] = useState(userData.rating || null);
  const [errors, setErrors] = useState({});

  const subjectFields = [
    "Biology", "Chemistry", "Physics", "Mathematics", "Engineering",
    "Computer Science", "Social Sciences", "Humanities", "Other"
  ];

  const validateField = (name, value) => {
    let error = "";
    if (value === "") return error;

    const num = Number(value);
    if (name === "educationYears" && (num < 1 || num > 10)) error = "Must be between 1–10";
    if (name === "gpa" && (num < 1 || num > 5)) error = "Must be between 1–5";
    if (name === "age" && (num < 10 || num > 99)) error = "Must be between 10–99";
    return error;
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
    <div className="demographics-page">
      <div className="loading-section">
        <img
         src="/images/gears.gif"
         alt="Loading..."
         style={{ width: "100px", height: "60px" }} />
        <p>We are calculating your Abstraction Quotient.<br />Meanwhile, please fill in some details about yourself for demographics purposes.</p>
      </div>

      <label>University:</label>
      <select value={university} onChange={handleUniversityChange}>
        <option value="">--Select--</option>
        <option value="TUM">TUM</option>
        <option value="LMU">LMU</option>
        <option value="Other">Other</option>
      </select>
      {university === "Other" && (
        <input
          type="text"
          placeholder="Enter University Name"
          value={otherUni}
          onChange={(e) => {
            setOtherUni(e.target.value);
            setUserData((prev) => ({ ...prev, university: e.target.value }));
          }}
        />
      )}

      <label>Degree Name:</label>
      <input type="text" name="degree" value={userData.degree || ""} onChange={handleChange} />

      <label>Level:</label>
      <select name="level" value={userData.level || ""} onChange={handleChange}>
        <option value="">--Select--</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
      </select>

      <label>Subject Field:</label>
      <select name="subjectField" value={userData.subjectField || ""} onChange={handleChange}>
        <option value="">--Select--</option>
        {subjectFields.map((field) => (
          <option key={field} value={field}>{field}</option>
        ))}
      </select>

      <label>Rate the test (1–10):</label>
      <div className="star-rating">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className={`star ${rating >= i + 1 ? "selected" : ""}`}
            onClick={() => handleRatingClick(i + 1)}
          >★</span>
        ))}
      </div>

      <label>Years in Higher Education:</label>
      <input
        type="text"
        name="educationYears"
        value={userData.educationYears || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) { // allows only digits
            handleChange(e);
          }
        }}
      />
      {errors.educationYears && <p className="error-message">{errors.educationYears}</p>}


      <label>GPA:</label>
      <input
        type="text"
        name="gpa"
        value={userData.gpa || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) { // allows only numbers and one decimal point
            handleChange(e);
          }
        }}
      />
      {errors.gpa && <p className="error-message">{errors.gpa}</p>}

      <label>Gender:</label>
      <select name="gender" value={userData.gender || ""} onChange={handleChange}>
        <option value="">--Select--</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label>Age:</label>
      <input
        type="text"
        name="age"
        value={userData.age || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) { // allows only digits
            handleChange(e);
          }
        }}
      />
      {errors.age && <p className="error-message">{errors.age}</p>}

      <label>Language Proficiency (A1–C2):</label>
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
        <button onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
};

export default DemographicsPage;