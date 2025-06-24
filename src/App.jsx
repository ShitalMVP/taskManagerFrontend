import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth pages
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NotFound from "./components/Auth/NotFound";

// Layout + Pages
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import DashboardContent from "./components/Dashboard/Dashboard";
import TaskManager from "./components/Tasks/TaskManager";

function App() {
	return (
		<>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />

					{/* Protected Route Group under /tasks */}
					<Route
						path="/tasks"
						element={
							<ProtectedRoute>
								<DashboardLayout />
							</ProtectedRoute>
						}>
						<Route path="dashboard" element={<DashboardContent />} />
						<Route path="manageTask" element={<TaskManager />} />
						<Route path="profile" element={<div>Profile Page</div>} />

						{/* fallback inside /tasks */}
						<Route path="*" element={<NotFound />} />
					</Route>

					{/* Global fallback 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
