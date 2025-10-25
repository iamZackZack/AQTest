import React from "react";

// Import all supported question components
import GridQuestion from "./GridQuestion";
import TriangleGridQuestion from "./TriangleGridQuestion";
import DragGroupQuestion from "./DragGroupQuestion";
import TextEntryQuestion from "./TextEntryQuestion";
import DragOrderQuestion from "./DragOrderQuestion";
import EitherOrQuestion from "./EitherOrQuestion";
import EitherOr4Question from "./EitherOr4Question";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import HexGridQuestion from "./HexGridQuestion";

// This component acts as a centralized renderer for all question types.
// It receives the current question and dispatches the correct component based on question.type.
const RenderQuestion = ({
  question,
  userAnswers,
  setUserAnswers,
  selectedAnswers,
  setSelectedAnswers,
  textEntryAnswers,
  setTextEntryAnswers,
  handleGridAnswerClick,
  handleGroupDragEnd,
  handleTextEntryChange,
  handleDragEnd,
  handleEitherOrSelect,
  shuffledOptions,
  getGridClass,
  handleAnswerClick,
  language
}) => {
  const type = question.type;

  // Render the appropriate question type based on its `type` field
  switch (type) {
    case "grid":
      return (
        <GridQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleGridAnswerClick={handleGridAnswerClick}
        />
      );
    case "triangle-grid":
      return (
        <TriangleGridQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleGridAnswerClick={handleGridAnswerClick}
        />
      );
    case "drag-group":
      return (
        <DragGroupQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleDragEnd={handleGroupDragEnd}
        />
      );
    case "text-entry":
      return (
        <TextEntryQuestion
          question={question}
          textEntryAnswers={textEntryAnswers}
          setTextEntryAnswers={setTextEntryAnswers}
          handleTextEntryChange={handleTextEntryChange}
        />
      );
    case "drag-order":
      return (
        <DragOrderQuestion
          question={{
            ...question,
            shuffledOptions,
          }}
          language={language}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleDragEnd={handleDragEnd}
        />
      );
    case "either-or":
      return (
        <EitherOrQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleEitherOrSelect={handleEitherOrSelect}
        />
      );
    case "either-or-4":
      return (
        <EitherOr4Question
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          handleEitherOrSelect={handleEitherOrSelect}
        />
      );

    case "hex-grid":
      return (
        <HexGridQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
        />
      );

    // Default to multiple choice if type is unknown or undefined
    default:
      return (
        <MultipleChoiceQuestion
          question={question}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
          shuffledOptions={shuffledOptions}
          getGridClass={getGridClass}
          handleAnswerClick={handleAnswerClick}
        />
      );
  }
};

export default RenderQuestion;