import apiClient from "@/lib/api";
import type { ApiResponse, GetCurrentUserResponse } from "@/types/responses";

export const UserService = {
	currentUser: async () => {
		const response =
			await apiClient.get<ApiResponse<GetCurrentUserResponse>>("/users/me");
		return response.data;
	},
};
