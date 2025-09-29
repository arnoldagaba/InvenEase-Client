import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createContext, useEffect, useState } from "react";

import { authService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

interface AuthContextType {
	isLoading: boolean;
	isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
	isLoading: true,
	isInitialized: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);
	const { setAccessToken, setUser, setIsAuthenticated, clearAuth } =
		useAuthStore();
	const queryClient = useQueryClient();

	useEffect(() => {
		const initAuth = async () => {
			try {
				// Attempt to refresh the access token using the HTTP-only cookie
				const response = await authService.refreshToken();

				if (response.success && response.data) {
					// Successfully refreshed - set authentication state
					setAccessToken(response.data.accessToken);
					setIsAuthenticated(true);

					// Fetch current user data
					try {
						const userResponse = await UserService.currentUser();
						if (userResponse.success && userResponse.data) {
							setUser(userResponse.data.user);
						}
					} catch (userError) {
						console.error("Failed to fetch user data:", userError);
						// Continue anyway, user will be fetched on next API call
					}
				}
			} catch {
				// No valid refresh token or it expired - user needs to login
				clearAuth();
				queryClient.clear();
			} finally {
				setIsLoading(false);
				setIsInitialized(true);
			}
		};

		initAuth();
	}, [setAccessToken, setUser, setIsAuthenticated, clearAuth, queryClient]);

	// Don't render children until auth is initialized
	if (!isInitialized) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ isLoading, isInitialized }}>
			{children}
		</AuthContext.Provider>
	);
}
