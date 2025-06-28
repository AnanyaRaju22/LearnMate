import { useState } from "react";

interface Task {
  id: number;
  text: string;
  date: string;
  done: boolean;
}

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");

  const addTask = () => {
    if (!taskText || !taskDate) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      date: taskDate,
      done: false,
    };
    setTasks((prev) =>
      [...prev, newTask].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setTaskText("");
    setTaskDate("");
  };

  const toggleDone = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-10 text-gray-800">
      <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8">
        📋 To-Do List
      </h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter your goal..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg border-purple-300"
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className="px-4 py-2 border rounded-lg border-purple-300"
          />
          <button
            onClick={addTask}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No goals added yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex justify-between items-center p-4 rounded-lg border ${task.done ? "bg-green-100" : "bg-purple-50"}`}
              >
                <div>
                  <p className={`font-semibold ${task.done ? "line-through text-gray-400" : ""}`}>
                    {task.text}
                  </p>
                  <p className="text-sm text-purple-700">🎯 Target: {task.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDone(task.id)}
                    className={`text-xs px-3 py-1 rounded-full font-bold ${task.done ? "bg-gray-400" : "bg-green-500"} text-white`}
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-400 text-white font-bold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
