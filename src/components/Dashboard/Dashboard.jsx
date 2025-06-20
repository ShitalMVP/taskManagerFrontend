import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const navigate = useNavigate();

	const [summary, setSummary] = useState({
		total: 0,
		completed: 0,
		pending: 0,
	});

	const [tasks, setTasks] = useState([]);

	// 🔐 Logout Handler
	const handleLogout = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
				withCredentials: true,
			});
			if (res.data.success) {
				toast.success("Logged out successfully");
				navigate("/login");
			} else {
				toast.error("Logout failed");
			}
		} catch (err) {
			console.error("Logout error:", err);
			toast.error("Logout failed");
		}
	};

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/api/stats`, {
					withCredentials: true,
				});
				if (res.data.success) {
					setSummary(res.data.data);
				} else {
					toast.error("Failed to fetch dashboard data");
				}
			} catch (error) {
				console.error("Dashboard summary error:", error);
				toast.error("Could not load dashboard summary");
			}
		};

		const fetchTasks = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/api/tasks`, {
					withCredentials: true,
				});
				setTasks(res.data.tasks);
			} catch (err) {
				console.error("Error fetching tasks:", err);
				toast.error("Failed to fetch tasks");
			}
		};

		fetchSummary();
		fetchTasks();
	}, []);

	return (
		<main className="flex-1 p-8">
			{/* Header with Logout */}
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-semibold">Dashboard</h1>
				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
				>
					Logout
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Total Tasks</p>
					<h3 className="text-2xl font-bold text-green-600">{summary.total}</h3>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Completed</p>
					<h3 className="text-2xl font-bold text-green-600">{summary.completed}</h3>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Pending</p>
					<h3 className="text-2xl font-bold text-green-600">{summary.pending}</h3>
				</div>
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
								<span
									className={`text-sm font-semibold px-2 py-1 rounded ${
										task.completed
											? "bg-green-100 text-green-700"
											: "bg-yellow-100 text-yellow-700"
									}`}
								>
									{task.completed ? "Completed" : "Pending"}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</main>
	);
}
