import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { User } from "@/types/auth";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const columns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		header: "Name",
		accessorKey: "firstName",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex flex-col">
					<span className="font-medium">
						{user.firstName} {user.lastName}
					</span>
					<span className="text-gray-500 text-sm">{user.email}</span>
				</div>
			);
		},
	},
	{
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="hover:bg-gray-100"
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		accessorKey: "email",
		cell: ({ row }) => (
			<span className="font-mono text-sm">{row.getValue("email")}</span>
		),
	},
	{
		header: "Role",
		accessorFn: (row) => row.role.name,
		cell: ({ row }) => {
			const role = row.original.role.name;
			const roleColor =
				role === "Admin"
					? "destructive"
					: role === "Manager"
						? "default"
						: "secondary";
			return (
				<Badge variant={roleColor} className="capitalize">
					{role}
				</Badge>
			);
		},
	},
	{
		header: "Status",
		accessorFn: (row) => row.isActive,
		cell: ({ row }) => {
			const isActive = row.original.isActive;
			return (
				<Badge
					variant={isActive ? "default" : "secondary"}
					className={
						isActive
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800"
					}
				>
					{isActive ? "Active" : "Inactive"}
				</Badge>
			);
		},
	},
	{
		header: "Last Login",
		accessorKey: "lastLoginAt",
		cell: ({ row }) => {
			const lastLogin = row.original.lastLoginAt;
			if (!lastLogin) {
				return <span className="text-gray-400 text-sm">Never</span>;
			}
			try {
				return (
					<span className="text-sm">
						{format(new Date(lastLogin), "MMM dd, yyyy")}
					</span>
				);
			} catch (error) {
				console.error('Date parsing error for lastLoginAt:', lastLogin, error);
				return <span className="text-gray-400 text-sm">Invalid Date</span>;
			}
		},
	},
	{
		header: "Created",
		accessorKey: "createdAt",
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			try {
				return (
					<span className="text-gray-500 text-sm">
						{format(new Date(createdAt), "MMM dd, yyyy")}
					</span>
				);
			} catch (error) {
				console.error('Date parsing error for createdAt:', createdAt, error);
				return <span className="text-gray-400 text-sm">Invalid Date</span>;
			}
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const user = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.email)
							}
						>
							Copy email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex items-center gap-2">
							<Eye className="h-4 w-4" />
							View details
						</DropdownMenuItem>
						<DropdownMenuItem className="flex items-center gap-2">
							<Edit className="h-4 w-4" />
							Edit user
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-600">
							<Trash2 className="h-4 w-4" />
							Delete user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];
