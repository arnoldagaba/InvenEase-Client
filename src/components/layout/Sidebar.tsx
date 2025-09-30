import { Link, useRouterState } from "@tanstack/react-router";
import { type LucideIcon, SidebarClose } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface NavItem {
	name: string;
	to: string;
	icon: LucideIcon;
	description?: string;
}

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<div
			className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
		>
			<div className="flex items-center-safe justify-between py-2.5 px-3 border-b border-gray-200">
				{!isCollapsed && (
					<Link to="/" className="text-xl font-bold text-gray-800">
						InvenEase
					</Link>
				)}

				<Button
					variant="ghost"
					title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					onClick={() => setIsCollapsed(!isCollapsed)}
					aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					<SidebarClose className={`${isCollapsed ? "rotate-180" : ""}`} />
				</Button>
			</div>

			<div className="flex-1"></div>

			<div className="">
				{!isCollapsed && (
					<div className="p-4 border-t border-gray-200">
						<div className="text-xs text-gray-500 flex">
							<p className="mr-2">&copy; InvenEase.</p>
							<p className="">All rights reserved</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
