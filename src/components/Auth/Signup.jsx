import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setusername] = useState("");

	const handleSignup = async (e) => {
		e.preventDefault();

		// ✅ Email must end in @gmail.com or @*.in
		const validEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9-]+\.(in))$/;

		if (!username || !email || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		if (!validEmail.test(email)) {
			toast.error("Only @gmail.com or @*.in email addresses are allowed");
			return;
		}

		try {
			const response = await axios.post(`${BASE_URL}/api/auth/register`, {
				username,
				email,
				password,
			});

			console.log(response);

			if (response.data?.success) {
				toast.success(response.data.message || "Signup successful");
				navigate("/login");
			} else {
				toast.error(response.data.message || "Signup failed");
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Error signing up");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<form
				onSubmit={handleSignup}
				className="bg-white p-8 rounded shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
				<input
					className="w-full px-4 py-2 mb-4 border rounded"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setusername(e.target.value)}
				/>

				<input
					className="w-full px-4 py-2 mb-4 border rounded"
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className="w-full px-4 py-2 mb-4 border rounded"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button
					className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
					type="submit"
				>
					Sign Up
				</button>
				<p className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link to="/" className="text-blue-600 hover:underline">
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}
