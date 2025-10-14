import { useEffect, useState } from "react";
import "../style/homepage.css";
import { motion } from "framer-motion";

type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

type TaskLog = {
  taskId: number;
  date: string;
  isCompleted: boolean;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL; // ✅ Använd .env

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const tasksResponse = await fetch(`${apiUrl}/api/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
        const tasksData: Task[] = await tasksResponse.json();
        setTasks(tasksData);

        const todayStr = new Date().toISOString().slice(0, 10);
        const logsResponse = await fetch(`${apiUrl}/api/tasklog`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!logsResponse.ok) throw new Error("Failed to fetch task logs");
        const logsData: TaskLog[] = await logsResponse.json();

        const checkedState: { [key: number]: boolean } = {};
        logsData.forEach((log) => {
          if (log.date.slice(0, 10) === todayStr) {
            checkedState[log.taskId] = log.isCompleted;
          }
        });
        setChecked(checkedState);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token, apiUrl]);

  // ✅ Toggle completion
  const toggleCheck = async (taskId: number) => {
    if (!token) return;

    const isNowChecked = !checked[taskId];
    const today = new Date();
    const localDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    try {
      await fetch(`${apiUrl}/api/tasklog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          TaskId: taskId,
          Date: localDate,
          IsCompleted: isNowChecked,
        }),
      });

      setChecked((prev) => ({ ...prev, [taskId]: isNowChecked }));
    } catch (err) {
      console.error("Failed to update task log:", err);
    }
  };

  // 🗑️ Delete task
  const handleDelete = async (taskId: number) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      "Är du säker på att du vill radera denna task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${apiUrl}/api/habits/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setChecked((prev) => {
          const newState = { ...prev };
          delete newState[taskId];
          return newState;
        });
      } else {
        console.error("Misslyckades att ta bort task:", res.statusText);
      }
    } catch (err) {
      console.error("Fel vid borttagning:", err);
    }
  };

  // ✏️ Starta redigering
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // 💾 Spara ändring
  const saveEdit = async (taskId: number) => {
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/api/habits/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Title: editTitle,
          Description: editDescription,
        }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, title: editTitle, description: editDescription }
              : t
          )
        );
        setEditingTaskId(null);
      } else {
        console.error("Misslyckades att uppdatera task:", res.statusText);
      }
    } catch (err) {
      console.error("Fel vid uppdatering:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="homepage"
    >
      <h2>Dagens Todo ✅</h2>

      {tasks.length === 0 ? (
        <p>Inga tasks ännu</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={checked[task.id] || false}
                onChange={() => toggleCheck(task.id)}
              />

              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Beskrivning..."
                  />
                  <div>
                    <button onClick={() => saveEdit(task.id)}>Spara</button>
                    <button onClick={() => setEditingTaskId(null)}>
                      Avbryt
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={checked[task.id] ? "completed" : ""}>
                    {task.title}
                  </span>
                  {task.description && <small> {task.description}</small>}
                  <div className="task-actions">
                    <button onClick={() => startEditing(task)}>Ändra</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Radera
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Home;
