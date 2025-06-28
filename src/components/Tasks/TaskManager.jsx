import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskManager = () => {
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const [user, setUser] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [formData, setFormData] = useState({ title: "", description: "" });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	
	const [showConfirmDelete, setShowConfirmDelete] = useState({
		show: false,
		id: null,
	});
	console.log(user?.userId, 'user deatil')
	const userId = user?.userId;
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/api/auth/me`, {
					withCredentials: true,
				});
				if (res.data.success) {
					setUser(res.data.user); // this sets user._id (your userId)
				}
			} catch (err) {
				console.error("Failed to load user", err);
				toast.error("Failed to load profile");
			}
		};

		fetchUser();
		fetchTasks();
	}, []);

	// 🔁 2nd useEffect - fetch tasks only when user is loaded

	useEffect(() => {
		if (user?._id) {
			fetchTasks(user._id);
		}
	}, [user]);

	const fetchTasks = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/api/tasks/getTasks/${userId}`, {
				withCredentials: true,
			});

			setTasks(res.data.tasks);
		} catch (err) {
			console.error("Error fetching tasks:", err);
			toast.error("Failed to fetch tasks");
		}
	};

	const openModal = (task = null) => {
		if (task) {
			setFormData({ title: task.title, description: task.description });
			setEditId(task._id);
		} else {
			setFormData({ title: "", description: "" });
			setEditId(null);
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setFormData({ title: "", description: "" });
		setIsModalOpen(false);
		setEditId(null);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title.trim()) return toast.error("Title is required");

		try {
			if (editId) {
				await axios.put(`${BASE_URL}/api/tasks/${editId}`, formData, {
					withCredentials: true,
				});
				toast.success("Task updated");
			} else {
				await axios.post(`${BASE_URL}/api/tasks`, formData, {
					withCredentials: true,
				});
				toast.success("Task added");
			}
			fetchTasks();
			closeModal();
		} catch (err) {
			console.error("Error saving task:", err);
			toast.error("Something went wrong");
		}
	};

	const toggleComplete = async (id, currentStatus) => {
		try {
			await axios.patch(
				`${BASE_URL}/api/tasks/${id}/status`,
				{
					completed: !currentStatus,
				},
				{
					withCredentials: true,
				}
			);
			fetchTasks();
			toast.success(`Marked as ${!currentStatus ? "completed" : "incomplete"}`);
		} catch (err) {
			console.error("Error toggling task:", err);
			toast.error("Failed to update status");
		}
	};

	const confirmDelete = (id) => {
		setShowConfirmDelete({ show: true, id });
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`${BASE_URL}/api/tasks/${showConfirmDelete.id}`, {
				withCredentials: true,
			});
			fetchTasks();
			setShowConfirmDelete({ show: false, id: null });
			toast.success("Task deleted");
		} catch (err) {
			console.error("Error deleting task:", err);
			toast.error("Failed to delete task");
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			{/* // Profile Header
// <div className="flex justify-between items-center mb-8">
// 	<div className="flex items-center space-x-4">
// 		<div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
// 			{user?.name?.[0].toUpperCase() || "U"}
// 		</div>
// 		<div>
// 			<p className="text-lg font-semibold text-gray-800">
// 				{user?.name || "User"}
// 			</p>
// 			<p className="text-sm text-gray-500">Welcome back!</p>
// 		</div>
// 	</div>
// </div> */}


			<h1 className="text-4xl font-bold text-green-700 mb-8">Task Manager</h1>
			<button
				onClick={() => openModal()}
				className="mb-6 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition">
				+ Add New Task
			</button>

			<div className="grid gap-6 sm:grid-cols-2">
				{tasks.map((task) => (
					<div
						key={task._id}
						className={`relative rounded-xl border p-5 shadow-sm transition hover:shadow-md ${task.completed
							? "border-green-400 bg-green-50"
							: "border-gray-200"
							}`}>
						<h2 className="text-lg font-semibold text-gray-800">
							{task.title}
						</h2>
						<p className="text-gray-600 mt-1 text-sm">{task.description}</p>

						<div className="flex justify-between items-center mt-5">
							<div className="flex gap-2">
								<button
									onClick={() => toggleComplete(task._id, task.completed)}
									className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${task.completed
										? "bg-gray-200 text-gray-800 hover:bg-gray-300"
										: "bg-green-500 text-white hover:bg-green-600"
										}`}>
									{task.completed ? "Undo" : "Complete"}
								</button>
								<button
									onClick={() => openModal(task)}
									className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-md text-sm font-medium transition">
									Edit
								</button>
							</div>
							<button
								onClick={() => confirmDelete(task._id)}
								className="text-sm text-red-500 hover:underline font-medium transition">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20">
					<div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg animate-fadeIn">
						<h2 className="text-2xl font-semibold mb-4">
							{editId ? "Edit Task" : "Create Task"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Task Title"
								className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Task Description"
								className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={closeModal}
									className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium">
									{editId ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
fetchTasks 
			{/* Confirm Delete Dialog */}
			{showConfirmDelete.show && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20">
					<div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center animate-fadeIn">
						<p className="text-lg font-medium mb-4">
							Are you sure you want to delete this task?
						</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={() => setShowConfirmDelete({ show: false, id: null })}
								className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium">
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskManager;
