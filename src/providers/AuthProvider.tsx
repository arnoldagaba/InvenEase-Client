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

    // Initialize auth state on app startup - this is the critical part
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to refresh token using HTTP-only cookie
                const refreshResponse = await authService.refreshToken();
                const { accessToken } = refreshResponse.data;

                // Get current user data
                const userResponse = await UserService.currentUser();
                const userData = userResponse.data.user;

                // Set authenticated state all at once
                setAuthenticatedUser(userData, accessToken);

                // biome-ignore lint/suspicious/noExplicitAny: Unknown error type
            } catch (error: any) {
                // Clear any stale auth state
                clearAuth();

                // Only set error for actual service failures (not just missing auth)
                // 401 = no valid refresh token (normal for logged out users)
                // 500+ = actual server errors that should show error state
                if (error.response?.status >= 500) {
                    setInitializationError(
                        "Authentication service unavailable. Please try again."
                    );
                } else {
                }
                // For 401, network errors, etc. - just proceed as unauthenticated
                // The router will automatically redirect to login
            } finally {
                setIsInitialized(true);
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
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
