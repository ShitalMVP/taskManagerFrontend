import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import DashboardContent from "./components/Dashboard/Dashboard"; // main dashboard content
import DashboardLayout from "./components/Dashboard/DashboardLayout"; // layout (sidebar + outlet)
import NotFound from "./components/Auth/NotFound";

function App() {
	return (
		<>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />

					{/* Protected Dashboard Layout */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardLayout />
							</ProtectedRoute>
						}>
						<Route index element={<DashboardContent />} />
						{/* Nested 404 inside Dashboard */}
						<Route path="*" element={<NotFound />} />
					</Route>

					{/* Global Fallback 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
