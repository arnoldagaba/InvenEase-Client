import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoadingScreen } from "@/components/LoadingScreen";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		// Wait for auth initialization if not complete
		if (!context.auth.isInitialized) {
			// Create a promise that resolves when auth is initialized
			await new Promise<void>((resolve) => {
				const checkInitialization = () => {
					if (context.auth.isInitialized) {
						resolve();
					} else {
						// Check again in 10ms
						setTimeout(checkInitialization, 10);
					}
				};
				checkInitialization();
			});
		}

		// Now that auth is initialized, check if user is authenticated
		if (!context.auth.isAuthenticated) {
			console.debug("🚫 User not authenticated, redirecting to login");
			throw redirect({
				to: "/login",
				search: {
					// Preserve the intended destination
					redirect: location.href,
				},
				replace: true,
			});
		}

		console.debug(
			"✅ User authenticated, allowing access to:",
			location.pathname,
		);
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { isInitialized } = Route.useRouteContext().auth;

	// Show loading if somehow auth isn't initialized yet
	if (!isInitialized) {
		return <LoadingScreen message="Loading application..." />;
	}

	return <AppLayout />;
}