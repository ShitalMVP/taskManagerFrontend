import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [identifier, setIdentifier] = useState(""); // Can be username or email
	const [password, setPassword] = useState("");
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!identifier || !password) {
			toast.error("Fill in all fields");
			return;
		}

		try {
			const response = await axios.post(
				`${BASE_URL}/api/auth/login`,
				{
					identifier, // username OR email
					password,
				},
				{
					withCredentials: true,
				}
			);

			if (response.data.success) {
				toast.success(response.data.message || "Login successful");
				localStorage.setItem("token", response.data.data);
				if (response.data.isNewUser) {
					localStorage.setItem("isNewUser", "true");
				} else {
					localStorage.removeItem("isNewUser");
				}
				navigate("/tasks/dashboard");
			} else {
				toast.error(response.data.message || "Login failed");
			}
		} catch (error) {
			console.error("Login Error:", error);
			toast.error(error.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<form
				onSubmit={handleLogin}
				className="bg-white p-8 rounded shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<input
					className="w-full px-4 py-2 mb-4 border rounded"
					type="text"
					placeholder="Username or Email"
					value={identifier}
					onChange={(e) => setIdentifier(e.target.value)}
				/>
				<input
					className="w-full px-4 py-2 mb-4 border rounded"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
					type="submit"
				>
					Login
				</button>
				<p className="mt-4 text-center text-sm">
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-600 hover:underline">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
