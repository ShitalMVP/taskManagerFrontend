import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    // Mock check (replace with real API call later)
    try {
      if (!identifier  || !password) {
        toast.error("Fill in all fields");
      } else {
        const respone = await axios.post(
          `${BASE_URL}/api/auth/login`,
          {
            identifier: identifier,
            password: password,
          },
          {
            withCredentials: true,
          }
        );
        console.log(respone);
        if (respone.data.success) {
          toast.success(respone.data.message || "Login successful");
          localStorage.setItem("token", respone.data.data);
          navigate("/tasks/dashboard");
        } else {
          toast.error(respone.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error logging in");
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
          placeholder="Email or Username" // 🔁 updated placeholder
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded"
          type={showPassword ? "text" : "password"}
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
