import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();

		// Automatically redirect based on auth status
		if (isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}

		throw redirect({ to: "/login" });
	},
});