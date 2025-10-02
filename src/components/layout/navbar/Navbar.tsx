import { SidebarCloseIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./BreadCrumbs";

interface NavbarProps {
	isCollapsed: boolean;
	setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ isCollapsed, setIsCollapsed }: NavbarProps) => {
	return (
		<div className="p-2 bg-white border border-gray-200 rounded-xl mr-2 mt-1.5">
			<div className="flex gap-4 items-center-safe justify-between">
				<Button
					variant="outline"
					className="hover:text-blue-500 p-1.5"
					onClick={() => setIsCollapsed(!isCollapsed)}
					aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					<SidebarCloseIcon
						size={16}
						className={`${isCollapsed && "rotate-180"}`}
					/>
					<span className="sr-only">Collapse</span>
				</Button>

				{/* Breadcrumbs */}
				<div className="flex-1 flex items-center">
					<Breadcrumbs />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
