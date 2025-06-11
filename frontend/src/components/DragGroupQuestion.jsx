import React from "react";
import "./styles/drag-group.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DragGroupQuestion = ({ question, userAnswers, setUserAnswers, handleDragEnd }) => {
  const questionId = question._id;
  const groupCount = question.groupCount || 2;
  const isValidGroupArray =
    Array.isArray(userAnswers[questionId]) &&
    userAnswers[questionId].length === groupCount &&
    userAnswers[questionId].every(Array.isArray);
  const initialGroups = isValidGroupArray
    ? userAnswers[questionId]
    : Array.from({ length: groupCount }, () => []);
  const assignedItems = new Set(initialGroups.flat());
  const unassignedOptions = question.options
  .map((o) => o.value)
  .filter((value) => !assignedItems.has(value));

  return (
    <div className="drag-group-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="options" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="drag-group-options-grid"
            >
              {unassignedOptions.map((value, index) => (
                <Draggable key={value} draggableId={value} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`drag-item2 ${snapshot.isDragging ? "dragging" : ""}`}
                    >
                      {value}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="drag-group-layout">
          <div className="criteria-label-top">
            {navigator.language.startsWith("de") ? "Kriterium 1" : "Criteria 1"}
          </div>

          <div className="drag-group-grid-wrapper">
            <div className="criteria-label-side">
              {navigator.language.startsWith("de") ? "Kriterium 2" : "Criteria 2"}
            </div>

            <div className="drag-group-columns">
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <Droppable key={groupIndex} droppableId={groupIndex.toString()}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={`drag-group color-${groupIndex}`}>
                      {initialGroups[groupIndex].map((word, index) => (
                        <Draggable key={word} draggableId={word} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="drag-item2"
                            >
                              {word}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>

      </DragDropContext>
    </div>
  );
};

export default DragGroupQuestion;