// components/DashboardContent.jsx
export default function DashboardContent() {
	return (
		<main className="flex-1 p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-semibold">Dashboard</h1>
				<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
					+ New Task
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Total Tasks</p>
					<h3 className="text-2xl font-bold text-green-600">12</h3>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Completed</p>
					<h3 className="text-2xl font-bold text-green-600">8</h3>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<p className="text-gray-600">Pending</p>
					<h3 className="text-2xl font-bold text-green-600">4</h3>
				</div>
			</div>

			{/* Task List Placeholder */}
			<div className="bg-white p-6 rounded shadow min-h-[300px]">
				<h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
				<p className="text-gray-500">Task list will appear here...</p>
			</div>
		</main>
	);
}
