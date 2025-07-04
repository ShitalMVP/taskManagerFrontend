import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const navigate = useNavigate();

	const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("all");
	const [showWelcome, setShowWelcome] = useState(false);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({ title: "", description: "" });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	const [showConfirmDelete, setShowConfirmDelete] = useState({ show: false, id: null });
	const [user, setUser] = useState(null);

	const userId = user?.userId;

	// ✅ Fetch tasks (used in multiple places)
	const fetchTasks = async () => {
		try {
			const query = filter !== "all" ? `?status=${filter}` : "";
			const res = await axios.get(`${BASE_URL}/api/tasks/getTasks/${userId}${query}`, );
			setTasks(res.data.tasks);
		} catch (err) {
			toast.error("Failed to fetch tasks");
		}
	};

	// ✅ Fetch user info
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/api/auth/me`, {
					withCredentials: true,
				});
				if (res.data.success) {
					setUser(res.data.user);
				}
			} catch (err) {
				toast.error("Failed to load user");
			}
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/api/auth/count`, { withCredentials: true });
				if (res.data.success) {
					setSummary(res.data);
				}
			} catch (err) {
				toast.error("Failed to fetch summary");
			}
		};
		fetchSummary();
		
	}, []);

	// ✅ Fetch tasks when user or filter changes
	useEffect(() => {
		if (user?.userId) {
			fetchTasks();
		}
	}, [user, filter]);

	// ✅ Welcome logic
	useEffect(() => {
		const isNewUser = localStorage.getItem("isNewUser");
		if (isNewUser === "true") {
			setShowWelcome(true);
			localStorage.removeItem("isNewUser");
		}
		setLoading(false);
	}, []);

	// ✅ Logout
	const handleLogout = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
			if (res.data.success) {
				toast.success("Logged out successfully");
				navigate("/login");
			}
		} catch (err) {
			toast.error("Logout failed");
		}
	};

	// ✅ Summary cards
	

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
			setFilter("all");
			fetchTasks();
			closeModal();
		} catch (err) {
			toast.error("Something went wrong");
		}
	};

	const toggleComplete = async (id, currentStatus) => {
		try {
			await axios.patch(
				`${BASE_URL}/api/tasks/${id}/status`,
				{ completed: !currentStatus },
				{ withCredentials: true }
			);
			fetchTasks();
			toast.success(`Marked as ${!currentStatus ? "completed" : "incomplete"}`);
		} catch (err) {
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
			toast.error("Failed to delete task");
		}
	};

	if (loading) return null;

	if (showWelcome) {
		return (
			<main className="flex-1 p-8 text-center">
				<h1 className="text-3xl font-bold text-green-700 mb-4">Welcome!</h1>
				<p className="text-gray-700 mb-2">You have no tasks yet. Let's get started!</p>
				<button
					onClick={() => navigate("/add-task")}
					className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Add Your First Task
				</button>
			</main>
		);
	}

	return (
		<main className="flex-1 p-8">
			{/* Header */}
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-semibold">Dashboard</h1>
				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Logout
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{["Total", "Completed", "Pending"].map((label, i) => {
					const value = [summary.totalTasks, summary.completedTasks, summary.pendingTasks][i];
					return (
						<div key={label} className="bg-white p-6 rounded shadow">
							<p className="text-gray-600">{label} Tasks</p>
							<h3 className="text-2xl font-bold text-green-600">{value}</h3>
						</div>
					);
				})}
			</div>

			{/* Filters */}
			<div className="flex space-x-4 mb-4">
				{["all", "completed", "pending"].map((status) => (
					<button
						key={status}
						className={`px-4 py-2 rounded ${
							filter === status ? "bg-blue-600 text-white" : "bg-gray-200"
						}`}
						onClick={() => setFilter(status)}
					>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</button>
				))}
			</div>

			{/* Task List */}
			<div className="bg-white p-6 rounded shadow min-h-[300px]">
				<h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
				{tasks.length === 0 ? (
					<p className="text-gray-500">No tasks available.</p>
				) : (
					<ul className="space-y-4">
						{tasks.map((task) => (
							<li
								key={task._id}
								className="border border-gray-200 rounded p-4 flex justify-between items-start"
							>
								<div>
									<h3 className="text-lg font-medium">{task.title}</h3>
									<p className="text-gray-500">{task.description}</p>
								</div>
								<div className="flex flex-col items-end space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2">
									<span
										className={`text-sm font-semibold px-2 py-1 rounded ${
											task.completed
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{task.completed ? "Completed" : "Pending"}
									</span>
									{!task.completed && (
										<button
											onClick={() => openModal(task)}
											className="text-sm px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
										>
											Edit
										</button>
									)}
									<button
										onClick={() => toggleComplete(task._id, task.completed)}
										className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
									>
										{task.completed ? "Undo" : "Complete"}
									</button>
									<button
										onClick={() => confirmDelete(task._id)}
										className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
									>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Task Modal */}
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
									className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
								>
									{editId ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Confirm Delete */}
			{showConfirmDelete.show && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20">
					<div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center animate-fadeIn">
						<p className="text-lg font-medium mb-4">Are you sure you want to delete this task?</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={() => setShowConfirmDelete({ show: false, id: null })}
								className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
