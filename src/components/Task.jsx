import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar } from "antd";

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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div`
  /* Optional styling */
`;

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

function bgcolorChange(props) {
  return props.isDraggingOver
    ? "lightgreen"
    : props.isDraggable
    ? props.isBacklog
      ? "#F2D7D5"
      : "#DCDCDC"
    : props.isBacklog
    ? "#F2D7D5"
    : "#EAF4FC";
}

export default function Card({ task, index, onDelete, onEdit, bgcolor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const handleSave = () => {
    if (editText.trim() === "") return; // Prevent empty task
    onEdit(task.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.title);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
          isDraggable
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
                  if (e.key === "Enter") {
                    handleSave();
                  }
                  if (e.key === "Escape") {
                    handleCancel();
                  }
                }}
                autoFocus
              />
            ) : (
              <TextContent>{task.title}</TextContent>
            )}
          </div>

          <Icons>
            {/* Pencil (Edit) icon */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-edit-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 3a2.828 2.828 0 014 4L7 21H3v-4L17 3z" />
                </svg>
              </button>
            )}

            {/* Save and Cancel buttons when editing */}
            {isEditing && (
              <>
                <button onClick={handleSave} aria-label="Save task" style={{ cursor: "pointer" }}>
                  Save
                </button>
                <button onClick={handleCancel} aria-label="Cancel edit" style={{ cursor: "pointer" }}>
                  Cancel
                </button>
              </>
            )}

            

            {/* Delete icon */}
            <div onClick={() => onDelete(task.id)} style={{ cursor: "pointer" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                fill="red"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
              </svg>
            </div>
          </Icons>

          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
