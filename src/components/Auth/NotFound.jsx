import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1>404 Not Found</h1>
			<p>The page you are looking for does not exist.</p>
			<button
				className="bg-green-600 text-white px-4 py-2 rounded"
				onClick={() => useNavigate("/login")}>
				Go Home
			</button>
		</div>
	);
};

export default NotFound;
