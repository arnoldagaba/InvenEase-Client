import { useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode,  useEffect } from "react";

import { authService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/auth";

interface AuthContextValue {
	isAuthenticated: boolean;
	isInitialized: boolean;
	user: User | null;
	initializationError: string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const {
		user,
		isAuthenticated,
		isInitialized,
		initializationError,
		setAuthenticatedUser,
		setIsInitialized,
		setInitializationError,
		clearAuth,
	} = useAuthStore();

	const queryClient = useQueryClient();

	// Initialize auth state on app startup - this is the critical part
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				console.debug("🔄 Initializing authentication...");

				// Try to refresh token using HTTP-only cookie
				const refreshResponse = await authService.refreshToken();
				const { accessToken } = refreshResponse.data;

				console.debug("✅ Token refresh successful");

				// Get current user data
				const userResponse = await UserService.currentUser();
				const userData = userResponse.data.user;

				console.debug("✅ User data retrieved:", userData.email);

				// Set authenticated state all at once
				setAuthenticatedUser(userData, accessToken);
			// biome-ignore lint/suspicious/noExplicitAny: Unknown error type
			} catch (error: any) {
				console.debug(
					"❌ Authentication initialization failed:",
					error.response?.status || error.message,
				);

				// Clear any stale auth state
				clearAuth();

				// Set error if it's not just "no auth cookie"
				if (error.response?.status !== 401) {
					setInitializationError(
						"Authentication service unavailable. Please try again.",
					);
				}
			} finally {
				setIsInitialized(true);
				console.debug("🏁 Auth initialization complete");
			}
		};

		// Only initialize once
		if (!isInitialized) {
			initializeAuth();
		}
	}, [
		isInitialized,
		setAuthenticatedUser,
		setIsInitialized,
		setInitializationError,
		clearAuth,
	]);

	// Clear queries when auth state changes to unauthenticated
	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			queryClient.clear();
		}
	}, [isAuthenticated, isInitialized, queryClient]);

	const contextValue: AuthContextValue = {
		isAuthenticated,
		isInitialized,
		user,
		initializationError,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};