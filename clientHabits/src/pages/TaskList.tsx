import { useState } from "react";
import "../style/tasklist.css";
import { motion } from "framer-motion";
import { CirclePlus, CircleMinus } from "lucide-react";

type Task = {
  title: string;
  description: string;
  checked: boolean;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { title: "", description: "", checked: false },
  ]);

  const handleChange = <K extends keyof Task>(
    index: number,
    key: K,
    value: Task[K]
  ) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, [key]: value } : task))
    );
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      { title: "", description: "", checked: false },
    ]);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Du måste vara inloggad för att spara tasks ❌");
        return;
      }

      for (const task of tasks) {
        const dto = { title: task.title, description: task.description };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/habits`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
          }
        );

        if (!response.ok) {
          console.error(
            `Misslyckades att spara task: ${task.title}`,
            await response.text()
          );
          alert(`Misslyckades att spara task: ${task.title}`);
          return;
        }
      }

      alert("Alla tasks sparade ✅");
    } catch (err) {
      console.error("Error saving tasks:", err);
      alert("Något gick fel vid sparande ❌");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="tasklist"
    >
      <div className="save-button">
        <button onClick={handleSave}>Save</button>
      </div>

      {tasks.map((task, index) => (
        <div className="tasklistHabitsTask" key={index}>
          <span>
            <textarea
              className="task-title"
              placeholder="Döp din task"
              value={task.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
          </span>

          <span>
            <textarea
              className="task-description"
              placeholder="Beskrivning"
              value={task.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
          </span>

          {tasks.length > 1 && (
            <button
              title="Ta bort"
              type="button"
              onClick={() => removeTask(index)}
            >
              <CircleMinus />
            </button>
          )}
        </div>
      ))}

      <div>
        <button title="Lägg till nytt task" onClick={addTask}>
          <CirclePlus />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskList;
