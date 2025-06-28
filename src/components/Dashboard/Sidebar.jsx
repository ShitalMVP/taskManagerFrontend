import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar() {
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

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
				console.error("Sidebar user fetch failed", err);
			}
		};

		fetchUser();
	}, []);

	const handleLogout = async () => {
		try {
			await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	return (
		<aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between">
			{/* Top Section */}
			<div className="p-6">
				<h2 className="text-2xl font-bold mb-6">Task Manager</h2>
				<nav className="space-y-4">
					<Link
						to="/tasks/dashboard"
						className="block text-gray-700 hover:text-green-600"
					>
						Dashboard
					</Link>
					<Link
						to="/tasks/manageTask"
						className="block text-gray-700 hover:text-green-600"
					>
						My Tasks
					</Link>
				</nav>
			</div>

			{/* Bottom Profile Section */}
			{user && (
				<div className="p-6 border-t">
					<Link
						to="/profile"
						className="flex items-center space-x-4 mb-3 hover:bg-gray-100 p-2 rounded transition"
					>
						<div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-semibold">
							{user.username?.charAt(0).toUpperCase()}
						</div>
						<div>
							<p className="font-medium text-gray-800">{user.username}</p>
							<p className="text-sm text-gray-500">{user.email}</p>
						</div>
					</Link>
				
				</div>
			)}
		</aside>
	);
}
