import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  // Load from localStorage or use empty array
  const getFromLocalStorage = (key) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  };

  const [completed, setCompleted] = useState(() => getFromLocalStorage("completed"));
  const [incomplete, setIncomplete] = useState(() => getFromLocalStorage("incomplete"));
  const [backlog, setBacklog] = useState(() => getFromLocalStorage("backlog"));
  const [inReview, setInReview] = useState(() => getFromLocalStorage("inReview"));

  // Sync to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("incomplete", JSON.stringify(incomplete));
  }, [incomplete]);

  useEffect(() => {
    localStorage.setItem("backlog", JSON.stringify(backlog));
  }, [backlog]);

  useEffect(() => {
    localStorage.setItem("inReview", JSON.stringify(inReview));
  }, [inReview]);

  // New state to hold task input value
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    console.log("📡 Fetching tasks...");

    fetch("https://kanban-board-api-8jph.onrender.com/")
      .then((res) => {
        console.log("🌐 Response received:", res);
        return res.json();
      })
      .then((tasks) => {
        console.log("✅ Parsed tasks:", tasks);

        const completed = tasks.filter((t) => t.status === "done");
        const incomplete = tasks.filter((t) => t.status === "todo");
        const inReview = tasks.filter((t) => t.status === "inReview");
        const backlog = tasks.filter((t) => t.status === "backlog");

        setCompleted(completed);
        setIncomplete(incomplete);
        setInReview(inReview);
        setBacklog(backlog);

        localStorage.setItem("completed", JSON.stringify(completed));
        localStorage.setItem("incomplete", JSON.stringify(incomplete));
        localStorage.setItem("inReview", JSON.stringify(inReview));
        localStorage.setItem("backlog", JSON.stringify(backlog));
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Helper to get and set list by droppableId
    const getList = (id) => {
      switch (id) {
        case "1":
          return [...incomplete];
        case "2":
          return [...completed];
        case "3":
          return [...inReview];
        case "4":
          return [...backlog];
        default:
          return [];
      }
    };

    const setList = (id, list) => {
      switch (id) {
        case "1":
          setIncomplete(list);
          break;
        case "2":
          setCompleted(list);
          break;
        case "3":
          setInReview(list);
          break;
        case "4":
          setBacklog(list);
          break;
      }
    };

    // Remove the task from source list
    const sourceList = getList(source.droppableId);
    const taskIndex = sourceList.findIndex((task) => task.id === draggableId);
    const [movedTask] = sourceList.splice(taskIndex, 1);

    // Update task's completed & status based on destination column
    let updatedTask = { ...movedTask };
    switch (destination.droppableId) {
      case "1":
        updatedTask.completed = false;
        updatedTask.status = "todo";
        break;
      case "2":
        updatedTask.completed = true;
        updatedTask.status = "done";
        break;
      case "3":
        updatedTask.completed = false;
        updatedTask.status = "inReview";
        break;
      case "4":
        updatedTask.completed = false;
        updatedTask.status = "backlog";
        break;
    }

    // Insert task in destination list at correct index
    const destinationList = getList(destination.droppableId);

    if (destination.droppableId === "4") {
      // Always add to end of backlog
      destinationList.push(updatedTask);
    } else {
      // Insert at the dropped index for other columns
      destinationList.splice(destination.index, 0, updatedTask);
    }

    // Update both source and destination lists
    setList(source.droppableId, sourceList);
    setList(destination.droppableId, destinationList);
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
        setIncomplete([...incomplete, updatedTask]);
        break;
      case "2": // DONE
        updatedTask = { ...task, completed: true };
        setCompleted([...completed, updatedTask]);
        break;
      case "3": // IN REVIEW
        updatedTask = { ...task, completed: false };
        setInReview([...inReview, updatedTask]);
        break;
      case "4": // BACKLOG
        updatedTask = { ...task, completed: false };
        setBacklog([...backlog, updatedTask]);
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

  const deleteTask = (id) => {
    setIncomplete((prev) => prev.filter((t) => t.id !== id));
    setCompleted((prev) => prev.filter((t) => t.id !== id));
    setInReview((prev) => prev.filter((t) => t.id !== id));
    setBacklog((prev) => prev.filter((t) => t.id !== id));
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
        <Column title={"TO DO"} tasks={incomplete} id={"1"} onDelete={deleteTask} />
        <Column title={"DONE"} tasks={completed} id={"2"} onDelete={deleteTask} />
        <Column title={"IN REVIEW"} tasks={inReview} id={"3"} onDelete={deleteTask} />
        <Column title={"BACKLOG"} tasks={backlog} id={"4"} onDelete={deleteTask} />
      </div>
    </DragDropContext>
  );
}
