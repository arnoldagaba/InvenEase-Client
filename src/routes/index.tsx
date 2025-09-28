import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/LoadingScreen";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		console.debug("🏠 Index beforeLoad:", {
			isInitialized: context.auth.isInitialized,
			isAuthenticated: context.auth.isAuthenticated,
			user: context.auth.user?.email,
		});

		// If auth is initialized, redirect based on auth status
		if (context.auth.isInitialized) {
			if (context.auth.isAuthenticated) {
				console.debug(
					"✅ Index: User authenticated → redirecting to /dashboard",
				);
				// User is authenticated - redirect to dashboard
				throw redirect({
					to: "/dashboard",
					replace: true,
				});
			} else {
				console.debug(
					"❌ Index: User not authenticated → redirecting to /login",
				);
				// User is not authenticated - redirect to login
				throw redirect({
					to: "/login",
					replace: true,
				});
			}
		}

		console.debug("⏳ Index: Auth not initialized yet, showing loading...");
		// If not initialized, let component handle loading state
	},
	component: IndexComponent,
});

function IndexComponent() {
	const { isInitialized, isAuthenticated, initializationError } =
		Route.useRouteContext().auth;

	console.debug("🏠 IndexComponent render:", {
		isInitialized,
		isAuthenticated,
		initializationError,
	});

	// This should only render during initialization
	// Once initialized, beforeLoad will handle redirects
	if (!isInitialized) {
		console.debug("⏳ IndexComponent: Showing initialization loading...");
		return <LoadingScreen message="Initializing application..." />;
	}

	// If there's a critical service error, show error with retry
	// Otherwise, let beforeLoad handle the redirect
	if (initializationError) {
		console.debug("❌ IndexComponent: Showing initialization error");
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4 max-w-md">
					<div className="text-red-500 text-lg font-medium">
						Service Unavailable
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

	// Manual redirect as fallback (beforeLoad should handle this)
	console.debug("🔄 IndexComponent: Manual fallback redirects");
	if (isAuthenticated) {
		console.debug("✅ IndexComponent: Fallback redirect to dashboard");
		window.location.replace("/dashboard");
		return <LoadingScreen message="Redirecting to dashboard..." />;
	} else {
		console.debug("❌ IndexComponent: Fallback redirect to login");
		window.location.replace("/login");
		return <LoadingScreen message="Redirecting to login..." />;
	}
}