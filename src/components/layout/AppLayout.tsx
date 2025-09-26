import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export function AppLayout() {
	return (
		<div className="h-screen flex flex-col">
			{/* Fixed navbar at top */}
			<Navbar />

			<div className="flex-1 flex overflow-hidden">
				{/* Sidebar */}
				<Sidebar />

				{/* Main content area */}
				<main className="flex-1 overflow-auto bg-gray-50 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}