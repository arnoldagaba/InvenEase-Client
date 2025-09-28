import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
    const { setAuthenticatedUser } = useAuthStore();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            // Set all auth state at once
            setAuthenticatedUser(data.data.user, data.data.accessToken);
            toast.success(data.message ?? "Welcome back!");
        },
        // biome-ignore lint/suspicious/noExplicitAny: Unknown error type
        onError: (error: any) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed";
            toast.error(message);
        },
    });
};

export const useLogout = () => {
    const { clearAuth } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: (data) => {
            clearAuth();
            queryClient.clear();
            toast.success(data.message || "Logged out successfully");

            // Navigate to login
            router.navigate({ to: "/login", replace: true });
        },
        onError: () => {
            // Even if server logout fails, clear local state
            clearAuth();
            queryClient.clear();

            // Navigate to login regardless
            router.navigate({ to: "/login", replace: true });

            // Show a warning toast instead of error
            toast.warning("Logged out (connection issue)");
        },
    });
};

export const useRefreshToken = () => {
    const { clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: authService.refreshToken,
        onSuccess: (data) => {
            // This hook is mainly used by the API interceptor
            // We don't have user data here, so just set the token
            const { setAccessToken, setIsAuthenticated } =
                useAuthStore.getState();
            setAccessToken(data.data.accessToken);
            setIsAuthenticated(true);
        },
        // biome-ignore lint/suspicious/noExplicitAny: Unknown error type
        onError: (error: any) => {
            clearAuth();
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: authService.changePassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password changed successfully");
        },
        // biome-ignore lint/suspicious/noExplicitAny: Unknown error type
        onError: (error: any) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to change password";
            toast.error(message);
        },
    });
};
