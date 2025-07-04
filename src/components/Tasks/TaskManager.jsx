import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskManager = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "", // ✅ New field
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks`, {
        withCredentials: true,
      });
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/api/tasks/${editingTaskId}`, formData, {
          withCredentials: true,
        });
        toast.success("Task updated");
      } else {
        await axios.post(`${BASE_URL}/api/tasks`, formData, {
          withCredentials: true,
        });
        toast.success("Task created");
      }

      // Reset
      setFormData({ title: "", description: "", dueDate: "" });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      toast.error("Error saving task");
    }
  };

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Manager</h2>
        <button
          onClick={() => {
            setFormData({ title: "", description: "", dueDate: "" });
            setIsEditMode(false);
            setEditingTaskId(null);
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + New Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task) => {
          const isOverdue =
            new Date(task.dueDate) < new Date() && !task.completed;

          return (
            <div
              key={task._id}
              className={`border p-4 rounded-lg shadow-sm ${
                isOverdue ? "bg-red-100" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-green-700">
                {task.title}
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
              {isOverdue && (
                <p className="text-red-600 font-medium text-sm">⚠️ Overdue</p>
              )}
              <button
                onClick={() => {
                  setFormData({
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate.slice(0, 10),
                  });
                  setIsEditMode(true);
                  setEditingTaskId(task._id);
                  setIsModalOpen(true);
                }}
                className="text-blue-600 text-sm mt-2"
              >
                ✏️ Edit
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task Title"
                required
                className="w-full px-4 py-2 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task Description"
                className="w-full px-4 py-2 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditingTaskId(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  {isEditMode ? "Update Task" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
