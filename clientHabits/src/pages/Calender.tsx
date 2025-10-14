import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../style/Calender.css";

type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

type TaskLog = {
  taskId: number;
  date: string; // ISO string
  isCompleted: boolean;
};

const weekdays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const monthNames = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

const Calender: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const blanks = Array(firstDayOfMonth(currentYear, currentMonth)).fill("");
  const daysArray = Array.from(
    { length: daysInMonth(currentYear, currentMonth) },
    (_, i) => i + 1
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const [tasksRes, logsRes] = await Promise.all([
          fetch(`${apiUrl}/api/habits`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/api/tasklog`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!tasksRes.ok || !logsRes.ok) {
          alert("Fel vid hämtning av tasks/loggar");
          console.error(
            "TasksRes:",
            await tasksRes.text(),
            "LogsRes:",
            await logsRes.text()
          );
          return;
        }

        const tasksData: Task[] = await tasksRes.json();
        const logsData: TaskLog[] = await logsRes.json();

        setTasks(tasksData);
        setTaskLogs(logsData);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Något gick fel vid hämtning av data");
      }
    };

    fetchData();
  }, []);

  const formatLocalDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .slice(0, 10);
  };

  const getTaskProgress = (day: number) => {
    const dateStr = new Date(currentYear, currentMonth, day)
      .toISOString()
      .slice(0, 10);
    const logsForDay = taskLogs.filter(
      (log) => formatLocalDate(log.date) === dateStr
    );

    const completed = logsForDay.filter((l) => l.isCompleted).length;
    const total = tasks.length;

    return total > 0 ? `${completed}/${total}` : "";
  };

  return (
    <motion.div
      className="calendar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <button
        onClick={() => {
          setCurrentMonth(today.getMonth());
          setCurrentYear(today.getFullYear());
        }}
      >
        Gå till idag
      </button>

      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {weekdays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {blanks.map((_, idx) => (
          <div key={`blank-${idx}`} className="calendar-day blank"></div>
        ))}

        {daysArray.map((day) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const progress = getTaskProgress(day);

          return (
            <div key={day} className={`calendar-day ${isToday ? "today" : ""}`}>
              <div>{day}</div>
              {progress && <small>{progress}</small>}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Calender;
