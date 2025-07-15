import React from "react";
import styled from "styled-components";
import Task from "./Task";
import "./scroll.css";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 100%;
  max-width: 300px; /* Optional for desktop control */
  height: 800px;
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
    transistion: background-color 0.2s ease;
    background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`;

export default function Column({ title, tasks, id, onDelete,onEdit })  {
    return (
        <Container className="column">
            <Title
                style={{
                    backgroundColor: "lightblue",
                    position: "sticky",
                    top: "0",
                }}
            >
                {title}
            </Title>
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        {tasks.map((task, index) => (
                            <Task key={task.id} index={index} task={task} onDelete={onDelete} onEdit={onEdit} />
                        ))}
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
        </Container>
    );
}