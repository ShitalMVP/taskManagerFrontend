import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [task, setTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  // Fetch task by ID on load
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tasks/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setTask(res.data.task);
        } else {
          toast.error("Task not found");
        }
      } catch (error) {
        toast.error("Error loading task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/api/tasks/${id}`, task, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Task updated successfully");
        navigate("/tasks/dashboard");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full border px-4 py-2 rounded"
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="w-full border px-4 py-2 rounded"
          rows={4}
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Description"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
