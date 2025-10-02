import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/users/Columns";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import UsersTable from "@/components/users/UserTable";
import { usePaginatedUsers } from "@/hooks/useUser";

export const Route = createFileRoute("/_authenticated/users")({
	beforeLoad: () => ({
		crumb: "Users",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<"asc" | "desc" | undefined>(undefined);

	const {
		data: res,
		isLoading,
		isError,
		error,
		isFetching,
	} = usePaginatedUsers({
		page,
		limit,
		search: search || undefined,
		sort,
	});

	// Show loading screen on initial load
	if (isLoading) {
		return <LoadingScreen message="Loading users..." />;
	}

	// Show error state
	if (isError) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="space-y-4 text-center">
					<div className="font-semibold text-lg text-red-500">
						Error Loading Users
					</div>
					<p className="text-gray-600">
						{error?.message ||
							"Something went wrong while loading users."}
					</p>
					<Button
						onClick={() => window.location.reload()}
						variant="outline"
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	// More robust data extraction with multiple fallback attempts
	let users = [];

	if (res?.data && Array.isArray(res.data)) {
		users = res.data;
	} else if (res?.users && Array.isArray(res.users)) {
		// Fallback: maybe the API returns { users: [...] }
		users = res.users;
	} else if (Array.isArray(res)) {
		// Fallback: maybe the API returns the array directly
		users = res;
	} else {
		console.warn("No users found in API response. Structure:", res);
		users = [];
	}

	console.log("Final users array:", users);
	console.log("Final users length:", users.length);
	const isRefetching = isFetching && !isLoading;

	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-xl">User Management</h2>
					<p className="text-gray-500 text-sm">
						Manage your team members and their account permissions
						here.
					</p>
				</div>
				<CreateUserDialog />
			</div>

			<div className="relative mt-8">
				{isRefetching && (
					<div className="absolute top-0 right-0 left-0 z-10 h-1 overflow-hidden rounded bg-blue-200">
						<div className="h-full animate-pulse bg-blue-500"></div>
					</div>
				)}
				<UsersTable
					columns={columns}
					data={users}
					pagination={{
						page,
						limit,
						setPage,
						setLimit,
					}}
					search={{
						value: search,
						onChange: setSearch,
					}}
					sorting={{
						sort,
						onSortChange: setSort,
					}}
				/>
			</div>
		</div>
	);
}
