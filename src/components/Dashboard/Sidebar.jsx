// components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
	return (
		<aside className="w-64 bg-white shadow-md p-6">
			<h2 className="text-2xl font-bold mb-6">Task Manager</h2>
			<nav className="space-y-4">
				<Link to="/" className="block text-gray-700 hover:text-green-600">
					Dashboard
				</Link>
				<Link to="/tasks" className="block text-gray-700 hover:text-green-600">
					My Tasks
				</Link>
				<Link
					to="/completed"
					className="block text-gray-700 hover:text-green-600">
					Completed
				</Link>
				<Link
					to="/settings"
					className="block text-gray-700 hover:text-green-600">
					Settings
				</Link>
			</nav>
		</aside>
	);
}
