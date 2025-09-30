import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context, location }) => {
		// Check auth from context (which comes from AuthProvider)
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AppLayout,
});