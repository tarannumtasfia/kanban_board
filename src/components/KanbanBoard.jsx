import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [inReview, setInReview] = useState([]);

  // New state to hold task input value
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000")
      .then((res) => res.json())
      .then((tasks) => {
        setCompleted(tasks.filter((t) => t.status === "done"));
        setIncomplete(tasks.filter((t) => t.status === "todo"));
        setInReview(tasks.filter((t) => t.status === "inReview"));
        setBacklog(tasks.filter((t) => t.status === "backlog"));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const task = findItemById(
      draggableId,
      [...incomplete, ...completed, ...inReview, ...backlog]
    );

    setNewState(destination.droppableId, task);
  };

  function deletePreviousState(sourceDroppableId, taskId) {
    switch (sourceDroppableId) {
      case "1":
        setIncomplete(removeItemById(taskId, incomplete));
        break;
      case "2":
        setCompleted(removeItemById(taskId, completed));
        break;
      case "3":
        setInReview(removeItemById(taskId, inReview));
        break;
      case "4":
        setBacklog(removeItemById(taskId, backlog));
        break;
    }
  }

  function setNewState(destinationDroppableId, task) {
    let updatedTask;
    switch (destinationDroppableId) {
      case "1": // TO DO
        updatedTask = { ...task, completed: false };
        setIncomplete([updatedTask, ...incomplete]);
        break;
      case "2": // DONE
        updatedTask = { ...task, completed: true };
        setCompleted([updatedTask, ...completed]);
        break;
      case "3": // IN REVIEW
        updatedTask = { ...task, completed: false };
        setInReview([updatedTask, ...inReview]);
        break;
      case "4": // BACKLOG
        updatedTask = { ...task, completed: false };
        setBacklog([updatedTask, ...backlog]);
        break;
    }
  }

  function findItemById(id, array) {
    return array.find((item) => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id != id);
  }

  // Function to add new task to the TO DO column
 const addTask = () => {
  if (!newTaskText.trim()) return;

  // Count total tasks across all columns
  const totalTasks =
    incomplete.length + completed.length + inReview.length + backlog.length;

  // New id is totalTasks + 1, converted to string
  const newId = (totalTasks + 1).toString();

  const newTask = {
    id: newId,
    title: newTaskText,
    completed: false,
    status: "todo",
  };

  setIncomplete([...incomplete, newTask]);
  setNewTaskText("");
};


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      {/* Add Task Input & Button */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto 20px auto",
          padding: "0 16px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Add new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          style={{
            flexGrow: 1,
            maxWidth: "400px",
            padding: "8px",
            fontSize: "16px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "16px",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1300px",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <Column title={"TO DO"} tasks={incomplete} id={"1"} />
        <Column title={"DONE"} tasks={completed} id={"2"} />
        <Column title={"IN REVIEW"} tasks={inReview} id={"3"} />
        <Column title={"BACKLOG"} tasks={backlog} id={"4"} />
      </div>
    </DragDropContext>
  );
}
