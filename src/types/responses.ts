import type { User } from "./auth";

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data: T;
	meta?: ResponseMeta;
}

export interface ResponseMeta {
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	filters?: Record<string, unknown>;
	sort?: {
		field: string;
		direction: "asc" | "desc";
	};
}

export interface LoginResponse {
	accessToken: string;
	user: User;
}

export interface RefreshResponse {
	accessToken: string;
}

export interface RegisterResponse {
	user: User;
}

export interface GetAllUsersResponse {
	users: User[];
}

export interface GetCurrentUserResponse {
	user: User;
}
