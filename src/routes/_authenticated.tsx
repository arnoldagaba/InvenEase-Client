import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ location }) => {
		const { isAuthenticated } = useAuthStore.getState();

		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AppLayoutComponent,
});

function AppLayoutComponent() {
	return <AppLayout />;
}
