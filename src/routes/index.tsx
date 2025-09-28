import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoadingScreen } from "@/components/LoadingScreen";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		// If auth is initialized, redirect based on auth status
		if (context.auth.isInitialized) {
			if (context.auth.isAuthenticated) {
				// User is authenticated - redirect to dashboard
				throw redirect({
					to: "/dashboard",
					replace: true,
				});
			} else {
				// User is not authenticated - redirect to login
				throw redirect({
					to: "/login",
					replace: true,
				});
			}
		}
		// If not initialized, let component handle loading state
	},
	component: IndexComponent,
});

function IndexComponent() {
	const { isInitialized, initializationError } = Route.useRouteContext().auth;

	// This should only render during initialization
	// Once initialized, beforeLoad will handle redirects
	if (!isInitialized) {
		return <LoadingScreen message="Initializing application..." />;
	}

	// Show error if initialization failed
	if (initializationError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4 max-w-md">
					<div className="text-red-500 text-lg font-medium">
						Initialization Error
					</div>
					<p className="text-gray-600">{initializationError}</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	// Fallback - this should rarely render due to beforeLoad redirects
	return <LoadingScreen message="Redirecting..." />;
}
