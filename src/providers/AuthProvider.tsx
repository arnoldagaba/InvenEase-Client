import { useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { authService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

export interface AuthContextType {
	isLoading: boolean;
	isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const {
		setAccessToken,
		setUser,
		setIsAuthenticated,
		clearAuth,
		isAuthenticated,
	} = useAuthStore();
	const queryClient = useQueryClient();

	useEffect(() => {
		const initAuth = async () => {
			console.log("🔄 Attempting to refresh token...");
			try {
				// Attempt to refresh the access token using the HTTP-only cookie
				const response = await authService.refreshToken();
				console.log("✅ Token refresh successful:", response);

				if (response.success && response.data) {
					// Successfully refreshed - set authentication state
					setAccessToken(response.data.accessToken);
					setIsAuthenticated(true);

					// Fetch current user data
					try {
						const userResponse = await UserService.currentUser();
						if (userResponse.success && userResponse.data) {
							setUser(userResponse.data);
						}
					} catch (userError) {
						console.error("Failed to fetch user data:", userError);
						// Continue anyway, user will be fetched on next API call
					}
				}
			} catch (error) {
				// No valid refresh token or it expired - user needs to login
				console.log("❌ Token refresh failed:", error);
				clearAuth();
				queryClient.clear();
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, [setAccessToken, setUser, setIsAuthenticated, clearAuth, queryClient]);

	// Show loading state while checking authentication
	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<AuthContext.Provider value={{ isLoading, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}
