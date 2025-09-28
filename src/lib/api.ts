import axios, {
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { StatusCodes } from "http-status-codes";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

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
	async (error) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Check if error is 401 and we haven't already tried to refresh
		if (
			error.response?.status === StatusCodes.UNAUTHORIZED &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/auth/refresh")
		) {
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
				const response = await authService.refreshToken();
				const { accessToken } = response.data;

				// Update the access token in our store
				useAuthStore.getState().setAccessToken(accessToken);

				// Process the queue with the new token
				processQueue(null, accessToken);

				// Update the original request with the new token and retry
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError) {
				// Refresh failed, log out the user
				processQueue(refreshError, null);
				useAuthStore.getState().clearAuth();

				// Optionally redirect to login page
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
