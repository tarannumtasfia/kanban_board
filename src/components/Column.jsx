import React from "react";
import styled from "styled-components";
import Task from "./Task";
import "./scroll.css";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const Container = styled.div`
  border-radius: 2.5px;
  width: 100%;
  max-width: 300px;
  height: 700px;
  overflow-y: scroll;
  border: 1px solid gray;
  box-sizing: border-box;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: #f4f5f7;
  flex-grow: 1;
  min-height: 100px;
`;

export default function Column({ title, tasks, id, onDelete, onEdit, color }) {
  // ✅ Use the column id for the droppable — same id used in Board's handleDragEnd
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: color,
          position: "sticky",
          top: "0",
        }}
      >
        {title}
      </Title>

      {/* ✅ SortableContext wraps the TaskList; items must be string ids */}
      <SortableContext
        items={tasks.map((t) => `${t.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {/* ✅ setNodeRef goes on TaskList so the droppable area covers the cards */}
        <TaskList
          ref={setNodeRef}
          style={{
            backgroundColor: isOver ? "#e0e0e0" : "#f4f5f7",
          }}
        >
          {tasks.map((task, index) => (
            <Task
              key={task.id}
              index={index}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              bgcolor={color}
            />
          ))}
        </TaskList>
      </SortableContext>
    </Container>
  );
}