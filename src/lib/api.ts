import axios, {
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { StatusCodes } from "http-status-codes";

import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse, RefreshResponse } from "@/types/responses";

const VITE_API_URL =
	import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
	baseURL: VITE_API_URL,
	withCredentials: true,
	timeout: 10_000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue to store failed requests during refresh
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (error?: unknown) => void;
}> = [];

// Helper function to process the failed request queue
const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});

	failedQueue = [];
};

// Request interceptor: adds access token to requests
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const { accessToken } = useAuthStore.getState();

		// Add access token to Authorization header if available
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor: handles token refresh on 401 errors
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		// If response is successful, just return it
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (originalRequest.url?.includes("/auth/refresh")) {
			// Don't retry if the request was to the refresh endpoint
			return Promise.reject(error);
		}

		if (
			error.response?.status === StatusCodes.UNAUTHORIZED &&
			!originalRequest._retry
		) {
			// Check if error is 401 and we haven't already tried to refresh
			if (isRefreshing) {
				// If we're already refreshing, add this request to the queue
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Attempt to refresh the token using the HTTP-only cookie
				const response =
					await apiClient.post<ApiResponse<RefreshResponse>>("/auth/refresh");

				if (response.data.success && response.data.data) {
					const { accessToken } = response.data.data;

					// Update the access token in our store
					useAuthStore.getState().setAccessToken(accessToken);
					useAuthStore.getState().setIsAuthenticated(true);

					// Process the queue with the new token
					processQueue(null, accessToken);

					// Update the original request with the new token and retry
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}

					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				// Refresh failed, log out the user
				processQueue(refreshError, null);
				useAuthStore.getState().clearAuth();

				// Redirect to login page
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Extract server error message
		const serverMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message;
		// biome-ignore lint/suspicious/noExplicitAny: Unknown error type
		const customError = new Error(serverMessage) as any;
		customError.status = error.response?.status;
		customError.data = error.response?.data;

		return Promise.reject(customError);
	},
);

export default apiClient;
