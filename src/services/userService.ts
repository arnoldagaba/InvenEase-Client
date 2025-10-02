import apiClient from "@/lib/api";
import type { User } from "@/types/auth";
import type { ApiResponse } from "@/types/responses";

export const UserService = {
	currentUser: async () => {
		const response = await apiClient.get<ApiResponse<User>>("/users/me");
		return response.data;
	},
};
