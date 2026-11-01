import { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingCount = tasks.length - completedCount;

  function addTask() {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTask("");
  }

  function deleteTask(id) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditedTitle("");
    }
  }

  function toggleTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditedTitle(task.title);
  }

  function saveEdit(id) {
    if (editedTitle.trim() === "") return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, title: editedTitle.trim() }
          : task
      )
    );

    setEditingId(null);
    setEditedTitle("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditedTitle("");
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      <p>Manage your daily tasks</p>

      <div className="stats">
        <div className="stat-card">
          <h3>{tasks.length}</h3>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h3>{completedCount}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h3>{remainingCount}</h3>
          <p>Remaining</p>
        </div>
      </div>

      <div className="add-task">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks yet!</h3>
          <p>Add your first task and start organizing your day.</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>There are no tasks in this filter.</p>
        </div>
      ) : (
        <ul className="tasks-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingId === task.id ? (
                <input
                  className="edit-input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={
                    task.completed
                      ? "task-title completed"
                      : "task-title"
                  }
                >
                  {task.title}
                </span>
              )}

              {editingId === task.id ? (
                <div className="task-actions">
                  <button
                    className="save-btn"
                    onClick={() => saveEdit(task.id)}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="task-actions">
                  <button
                    className="complete-btn"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;