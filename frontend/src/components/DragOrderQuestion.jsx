import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./styles/drag-order.css";

const SortableItem = ({ id, questionId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
  };

  const isImage = typeof id === "string" && id.startsWith("/images");

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="drag-item"
    >
      {isImage ? (
        <img src={id} alt="Option" className="drag-item-image" />
      ) : (
        <span>{id}</span>
      )}
    </li>
  );
};

const DragOrderQuestion = ({ question, userAnswers, setUserAnswers, language }) => {
  const questionId = question._id;
  const isNumberedList = question.questionID === "Q119";
  const isAbstractScale = question.questionID === "Q104";

  // ✅ Prefer shuffled options if available
  const defaultOrder = (question.shuffledOptions || question.options).map((o) => o.value);
  const [items, setItems] = useState(userAnswers[questionId] || defaultOrder);

  useEffect(() => {
    const defaultOrder = (question.shuffledOptions || question.options).map((o) => o.value);
  
    const existingAnswer = userAnswers[questionId];
    if (existingAnswer) {
      setItems(existingAnswer);
    } else {
      setItems(defaultOrder);
    }
  }, [questionId, userAnswers, question.shuffledOptions, question.options]);
  
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      setItems(newItems);
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: newItems,
      }));
    }
  };

  return (
    <div className="drag-order-container">
      <div className="drag-flex-wrapper">
        {isAbstractScale && (
          <div className="abstract-label-column">
            <div className="abstract-label-top">
              {language === "de" ? "Detailliertesten" : "Most Detailed"}
            </div>
            <div className="abstract-label-spacer" />
            <div className="abstract-label-bottom">
              {language === "de" ? "Einfachsten" : "Simplest"}
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="drag-list">
              {items.map((id, index) => (
                <div className="drag-list-wrapper" key={`${questionId}-${id}`}>
                  {isNumberedList && (
                    <span className="drag-index">{index + 1}</span>
                  )}
                  <SortableItem id={id} questionId={question.questionID} />
                </div>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DragOrderQuestion;