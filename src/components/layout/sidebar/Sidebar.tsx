import { ChevronsUpDown, Search } from "lucide-react";
import { FormInput } from "@/components/forms";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

interface SidebarProps {
	isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
	const { user } = useAuthStore();

	return (
		<div
			className={`bg-white h-screen py-3 px-2.5 border-r border-gray-200 mr-2 shadow transition-all ${isCollapsed ? "w-17" : "w-64"}`}
		>
			{/* Header */}
			<button
				type="button"
				className="flex items-center justify-between transition-all hover:bg-gray-100 p-1.5 rounded w-full border border-gray-200 bg-gray-50 mb-5"
			>
				<div className="flex justify-center items-center">
					<p
						className={cn(
							"rounded-full bg-gray-50 border border-blue-100 text-blue-500 py-1 px-1.5",
							!isCollapsed && "mr-1.5",
						)}
					>
						{user?.firstName.charAt(0) || "J"}
						{user?.lastName.charAt(0) || "D"}
					</p>

					{!isCollapsed && (
						<div className="text-start leading-5">
							<span className="text-sm font-bold block">
								{user?.firstName || "John"} {user?.lastName || "Doe"}
							</span>
							<span className="text-xs text-gray-500 block">{user?.email}</span>
						</div>
					)}
				</div>

				{!isCollapsed && <ChevronsUpDown size={16} />}
			</button>

			{/* Content */}
			<div className="flex-1 flex flex-col gap-3">
				{!isCollapsed && (
					<div className="border-b pb-5 border-gray-200">
						<FormInput
							label="Search"
							labelClassName="sr-only"
							icon={Search}
							iconPosition="left"
							placeholder="Search"
						/>
					</div>
				)}

				<div className="">{/* navigation */}</div>
			</div>

			{/* Footer */}
			<div className=""></div>
		</div>
	);
};

export default Sidebar;
