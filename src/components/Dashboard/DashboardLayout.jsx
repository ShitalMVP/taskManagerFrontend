// components/Dashboard.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />
			<div className="flex-1 p-6 overflow-y-auto">
				<Outlet /> {/* This will render nested route content */}
			</div>
		</div>
	);
}
