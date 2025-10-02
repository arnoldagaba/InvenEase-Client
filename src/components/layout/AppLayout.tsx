import { Outlet } from "@tanstack/react-router";
import { useState } from "react";

import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

export function AppLayout() {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className="h-screen flex">
			<Sidebar isCollapsed={isCollapsed} />

			<div className="flex-1 overflow-hidden">
				<Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

				{/* Main content area */}
				<main className="flex-1 overflow-y-auto overflow-x-hidden bg-white mt-2 border border-gray-200 mr-2 rounded h-full p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
