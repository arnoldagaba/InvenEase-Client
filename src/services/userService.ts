import apiClient from "@/lib/api";
import type { User } from "@/types/auth";
import type { ApiResponse } from "@/types/responses";
import type { UpdateUserDTO } from "@/types/user";

export type PaginationParams = {
	page?: number;
	limit?: number;
	sort?: "asc" | "desc";
	search?: string;
};

export type CursorPagination = {
	cursor: string;
	take: number;
};

export const UserService = {
	currentUser: async () => {
		const response = await apiClient.get<ApiResponse<User>>("/users/me");
		return response.data;
	},

	createUser: async (user: User) => {
		const response = await apiClient.post<ApiResponse<User>>(
			"/users",
			user,
		);
		return response.data;
	},

	getPaginatedUsers: async ({
		page = 1,
		limit = 10,
		sort,
		search,
	}: PaginationParams) => {
		const params: Record<string, string | number | undefined> = {
			page,
			limit,
		};

		if (sort) params.sort = sort;
		if (search) params.search = search;

		console.log("=== API REQUEST DEBUG ===");
		console.log("Making request to /users with params:", params);

		const response = await apiClient.get<ApiResponse<User[]>>("/users", {
			params,
		});

		console.log("Raw API response:", response);
		console.log("Response data:", response.data);
		console.log("Response status:", response.status);
		console.log("========================");

		return response.data;
	},

	getUsersByCursor: async ({ cursor = "", take = 10 }: CursorPagination) => {
		const response = await apiClient.get<ApiResponse<User[]>>(
			`/users/cursor`,
			{
				params: { cursor, take },
			},
		);
		return response.data.data;
	},

	getUserById: async (id: string) => {
		const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
		return response.data;
	},

	updateUser: async (id: string, user: UpdateUserDTO) => {
		const response = await apiClient.put<ApiResponse<User>>(
			`/users/${id}`,
			user,
		);
		return response.data;
	},

	deleteUser: async (id: string, hard?: true) => {
		const response = await apiClient.delete<ApiResponse<User>>(
			`/users/${id}`,
			{
				params: { hard },
			},
		);
		return response.data;
	},
};
