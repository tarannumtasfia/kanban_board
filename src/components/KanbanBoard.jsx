import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  // Load from localStorage or default empty array
  const getFromLocalStorage = (key) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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

  // Improved fetch logic with validation
  useEffect(() => {
    const isValidData = (key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) && data.length > 0;
      } catch {
        return false;
      }
    };

    const allHaveData =
      isValidData("completed") &&
      isValidData("incomplete") &&
      isValidData("inReview") &&
      isValidData("backlog");

    if (allHaveData) {
      console.log("Using saved data from localStorage, skipping fetch");
      return;
    }

    console.log("📡 Fetching tasks from API...");

    fetch("https://kanban-board-api.vercel.app/")
      .then((res) => res.json())
      .then((tasks) => {
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

  // Drag and drop logic
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

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

    const sourceList = getList(source.droppableId);
    const taskIndex = sourceList.findIndex((task) => task.id === draggableId);
    const [movedTask] = sourceList.splice(taskIndex, 1);

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

    const destinationList = getList(destination.droppableId);

    if (destination.droppableId === "4") {
      destinationList.push(updatedTask);
    } else {
      destinationList.splice(destination.index, 0, updatedTask);
    }

    setList(source.droppableId, sourceList);
    setList(destination.droppableId, destinationList);
  };

  // Add new task
  const addTask = () => {
    if (!newTaskText.trim()) return;

    const allTasks = [...incomplete, ...completed, ...inReview, ...backlog];
    const maxId = allTasks.reduce((max, task) => Math.max(max, Number(task.id)), 0);
    const newId = (maxId + 1).toString();

    const newTask = {
      id: newId,
      title: newTaskText,
      completed: false,
      status: "todo",
    };

    setIncomplete([...incomplete, newTask]);
    setNewTaskText("");
  };

  // Delete task
  const deleteTask = (id) => {
    setIncomplete((prev) => prev.filter((t) => t.id !== id));
    setCompleted((prev) => prev.filter((t) => t.id !== id));
    setInReview((prev) => prev.filter((t) => t.id !== id));
    setBacklog((prev) => prev.filter((t) => t.id !== id));
  };
  const editTask = (taskId, newTitle) => {
  const updateTasks = (tasks) =>
    tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task));

  setIncomplete((prev) => updateTasks(prev));
  setCompleted((prev) => updateTasks(prev));
  setInReview((prev) => updateTasks(prev));
  setBacklog((prev) => updateTasks(prev));
};


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

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
        <Column title={"TO DO"} tasks={incomplete} id={"1"} onDelete={deleteTask} onEdit={editTask}/>
        <Column title={"DONE"} tasks={completed} id={"2"} onDelete={deleteTask}   onEdit={editTask} />
        <Column title={"IN REVIEW"} tasks={inReview} id={"3"} onDelete={deleteTask}  onEdit={editTask}/>
        <Column title={"BACKLOG"} tasks={backlog} id={"4"} onDelete={deleteTask}  onEdit={editTask}/>
      </div>
    </DragDropContext>
  );
}
