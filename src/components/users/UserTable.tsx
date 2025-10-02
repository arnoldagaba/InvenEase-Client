import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@/types/auth";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

interface PaginationProps {
	page: number;
	limit: number;
	setPage: (page: number) => void;
	setLimit: (limit: number) => void;
}

interface SearchProps {
	value: string;
	onChange: (value: string) => void;
}

interface SortingProps {
	sort: "asc" | "desc" | undefined;
	onSortChange: (sort: "asc" | "desc" | undefined) => void;
}

interface UserTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pagination?: PaginationProps;
	search?: SearchProps;
	sorting?: SortingProps;
}

const UserTable = ({
	columns,
	data,
	pagination,
	search,
	sorting,
}: UserTableProps<User, unknown>) => {
	const [localSorting, setLocalSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{},
	);
	const [rowSelection, setRowSelection] = useState({});
	const [searchInput, setSearchInput] = useState(search?.value || "");

	// Debounced search to avoid too many API calls
	useEffect(() => {
		if (!search) return;

		const timeoutId = setTimeout(() => {
			search.onChange(searchInput);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchInput, search]);

	// Sync search input with external value
	useEffect(() => {
		if (search && search.value !== searchInput) {
			setSearchInput(search.value);
		}
	}, [search?.value, searchInput, search]);

	const pageCount = useMemo(() => {
		if (!pagination) return -1;
		// Since we don't have total count from API, we'll use a simple approach
		return -1; // -1 means unknown page count
	}, [pagination]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setLocalSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		pageCount,
		manualPagination: !!pagination,
		manualSorting: !!sorting,
		manualFiltering: !!search,
		state: {
			sorting: localSorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: pagination
				? {
						pageIndex: pagination.page - 1, // TanStack uses 0-based indexing
						pageSize: pagination.limit,
					}
				: {
						pageIndex: 0,
						pageSize: 10,
					},
		},
	});

	return (
		<div className="space-y-4">
			{/* Search and Controls */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-1 items-center gap-4">
					{/* Search Input */}
					<div className="relative max-w-sm flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<Input
							placeholder="Search users..."
							value={searchInput}
							onChange={(event) =>
								setSearchInput(event.target.value)
							}
							className="pl-10"
						/>
					</div>

					{/* Page Size Selector */}
					{pagination && (
						<Select
							value={pagination.limit.toString()}
							onValueChange={(value) => {
								pagination.setLimit(Number(value));
								pagination.setPage(1); // Reset to first page
							}}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5</SelectItem>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectContent>
						</Select>
					)}
				</div>

				{/* Column Visibility Toggle */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<div className="flex flex-col items-center gap-2">
										<span className="text-gray-500">No users found</span>
										<span className="text-sm text-gray-400">
											{data?.length === 0 ? 
												'No users match your search criteria' : 
												'Loading users...'
											}
										</span>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			{pagination && (
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center space-x-2">
						<p className="text-gray-700 text-sm">
							{table.getFilteredSelectedRowModel().rows.length >
								0 && (
								<span>
									{
										table.getFilteredSelectedRowModel().rows
											.length
									}{" "}
									of {table.getFilteredRowModel().rows.length}{" "}
									row(s) selected
								</span>
							)}
						</p>
					</div>

					<div className="flex items-center space-x-2">
						<p className="text-gray-700 text-sm">
							Page {pagination.page} • {pagination.limit} per page
						</p>

						<div className="flex items-center space-x-1">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									pagination.setPage(
										Math.max(1, pagination.page - 1),
									)
								}
								disabled={pagination.page <= 1}
								className="flex items-center gap-1"
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									pagination.setPage(pagination.page + 1)
								}
								disabled={data.length < pagination.limit}
								className="flex items-center gap-1"
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserTable;
