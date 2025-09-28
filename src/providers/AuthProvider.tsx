import { useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useEffect } from "react";

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

	console.debug("🔐 AuthProvider render:", {
		isAuthenticated,
		isInitialized,
		userEmail: user?.email,
		initializationError,
	});

	// Initialize auth state on app startup - this is the critical part
	useEffect(() => {
		console.debug(
			"🔄 AuthProvider useEffect triggered, isInitialized:",
			isInitialized,
		);

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
				console.debug("✅ Authentication state set successfully");

				// biome-ignore lint/suspicious/noExplicitAny: Unknown error type
			} catch (error: any) {
				console.debug(
					"❌ Authentication initialization failed:",
					error.response?.status || error.message,
				);

				// Clear any stale auth state
				clearAuth();

				// Only set error for actual service failures (not just missing auth)
				// 401 = no valid refresh token (normal for logged out users)
				// 500+ = actual server errors that should show error state
				if (error.response?.status >= 500) {
					console.debug(
						"❌ Setting initialization error for status:",
						error.response?.status,
					);
					setInitializationError(
						"Authentication service unavailable. Please try again.",
					);
				} else {
					console.debug(
						"ℹ️ No initialization error set for status:",
						error.response?.status,
					);
				}
				// For 401, network errors, etc. - just proceed as unauthenticated
				// The router will automatically redirect to login
			} finally {
				setIsInitialized(true);
				console.debug(
					"🏁 Auth initialization complete - isInitialized set to true",
				);
			}
		};

		// Only initialize once
		if (!isInitialized) {
			console.debug("🚀 Starting auth initialization...");
			initializeAuth();
		} else {
			console.debug("ℹ️ Auth already initialized, skipping");
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
			console.debug("🧹 Clearing query cache - user not authenticated");
			queryClient.clear();
		}
	}, [isAuthenticated, isInitialized, queryClient]);

	const contextValue: AuthContextValue = {
		isAuthenticated,
		isInitialized,
		user,
		initializationError,
	};

	console.debug("🎯 AuthProvider providing context value:", contextValue);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};