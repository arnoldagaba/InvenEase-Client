import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export function AppLayout() {
	return (
		<div className="h-screen flex">
			<Sidebar />

			<div className="flex-1 overflow-auto">
				<Navbar />

				{/* Main content area */}
				<main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
