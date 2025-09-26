import apiClient from "@/lib/api";
import type { ChangePasswordDTO, LoginDTO } from "@/types/auth";
import type {
	ApiResponse,
	LoginResponse,
	RefreshResponse,
} from "@/types/responses";

export const authService = {
	login: async (data: LoginDTO) => {
		const response = await apiClient.post<ApiResponse<LoginResponse>>(
			"/auth/login",
			data,
		);
		return response.data;
	},

	refreshToken: async () => {
		const response = await apiClient.post<ApiResponse<RefreshResponse>>(
			"/auth/refresh",
			{},
			{ withCredentials: true },
		);
		return response.data;
	},

	logout: async () => {
		const response = await apiClient.post<ApiResponse<undefined>>("/auth/logout");
		return response.data;
	},

	changePassword: async (data: ChangePasswordDTO) => {
		const response = await apiClient.put<ApiResponse<undefined>>(
			"/auth/change-password",
			data,
		);
		return response.data;
	},
};
