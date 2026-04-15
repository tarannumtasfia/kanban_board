import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 120px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => props.bgcolor || "#EAF4FC"};
  cursor: grab;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const InputEdit = styled.input`
  width: 100%;
  padding: 6px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 2px;
`;

export default function Card({ task, index, onDelete, onEdit, bgcolor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${task.id}` });

  const style = {
    // ✅ CSS.Translate instead of CSS.Transform — prevents card scaling/stretching
    transform: CSS.Translate.toString(transform),
    // ✅ Disable transition while actively dragging for instant cursor-follow feel
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.4 : 1,
    boxShadow: isDragging ? "0 16px 32px rgba(0,0,0,0.25)" : "5px 5px 5px 2px grey",
    zIndex: isDragging ? 999 : "auto",
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handleSave = () => {
    if (editText.trim() === "") return;
    onEdit(task.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.title);
    setIsEditing(false);
  };

  return (
    <Container
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      bgcolor={bgcolor}
      isBacklog={task.isBacklog}
    >
      <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
        <small>#{task.id}{"  "}</small>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: 2 }}>
        {isEditing ? (
          <InputEdit
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <TextContent>{task.title}</TextContent>
        )}
      </div>

      <Icons>
        {!isEditing && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
            >
              <path d="M17 3a2.828 2.828 0 014 4L7 21H3v-4L17 3z" />
            </svg>
          </button>
        )}

        {isEditing && (
          <>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={handleSave}
              aria-label="Save task" style={{ cursor: "pointer" }}>
              Save
            </button>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={handleCancel}
              aria-label="Cancel edit" style={{ cursor: "pointer" }}>
              Cancel
            </button>
          </>
        )}

        <div onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(task.id)}
          style={{ cursor: "pointer" }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="red">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
          </svg>
        </div>
      </Icons>
    </Container>
  );
}