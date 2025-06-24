// components/Sidebar.jsx
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
	LogOut,
	User,
	LayoutDashboard,
	ListChecks,
	ChevronDown,
} from "lucide-react";
import { useState, useRef } from "react";

export default function Sidebar() {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	const handleLogout = async () => {
		try {
			const BASE_URL = import.meta.env.VITE_BASE_URL;
			const response = await axios.post(`${BASE_URL}/api/auth/logout`, {});
			if (response.data.success) {
				localStorage.removeItem("token");
				navigate("/login");
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};
	const handleNavigate = () => {
		toggleMenu();
		navigate("/tasks/profile");
	};

	return (
		<aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between h-screen">
			<div>
				<h2 className="text-2xl font-bold mb-6">Task Manager</h2>
				<nav className="space-y-4">
					<Link
						to="/tasks/dashboard"
						className="flex items-center gap-2 text-gray-700 hover:text-green-600">
						<LayoutDashboard size={18} /> Dashboard
					</Link>
					<Link
						to="/tasks/manageTask"
						className="flex items-center gap-2 text-gray-700 hover:text-green-600">
						<ListChecks size={18} /> My Tasks
					</Link>
				</nav>
			</div>

			{/* Profile Menu */}
			<div className="relative" ref={menuRef}>
				<button
					onClick={toggleMenu}
					className="w-full flex items-center justify-between bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
					<div className="flex items-center gap-2">
						<User size={18} /> Profile
					</div>
					{menuOpen ? (
						<ChevronDown size={18} className="transform rotate-180" />
					) : (
						<ChevronDown size={18} />
					)}
				</button>
				{menuOpen && (
					<div className="absolute bottom-14 left-0 bg-white border rounded shadow-md w-full z-10">
						<button
							onClick={handleNavigate}
							className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
							<User size={16} /> View Profile
						</button>
						<button
							onClick={handleLogout}
							className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
							<LogOut size={16} /> Logout
						</button>
					</div>
				)}
			</div>
		</aside>
	);
}
