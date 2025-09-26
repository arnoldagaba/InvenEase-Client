import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
	const { setAccessToken, setUser, setIsAuthenticated } = useAuthStore();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			setAccessToken(data.data.accessToken);
			setUser(data.data.user);
			setIsAuthenticated(true);
			toast.success(data.message);
			navigate({ to: "/dashboard", replace: true });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const useLogout = () => {
	const { clearAuth } = useAuthStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authService.logout,
		onSuccess: (data) => {
			clearAuth();
			toast.success(data.message);
			queryClient.removeQueries();
			navigate({ to: "/login", replace: true });
		},
		onError: () => {
			clearAuth();
			queryClient.clear();
			navigate({ to: "/login", replace: true });
		},
	});
};

export const useRefreshToken = () => {
	const { setAccessToken, clearAuth } = useAuthStore();

	return useMutation({
		mutationFn: authService.refreshToken,
		onSuccess: (data) => {
			setAccessToken(data.data.accessToken);
		},
		onError: () => {
			clearAuth();
		},
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: authService.changePassword,
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
