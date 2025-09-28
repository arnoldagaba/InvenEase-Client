import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/")({
    beforeLoad: async () => {
        // Wait for auth initialization using the global auth store to avoid stale context
        await new Promise<void>((resolve) => {
            const { isInitialized } = useAuthStore.getState();
            if (isInitialized) {
                resolve();
                return;
            }
            const unsubscribe = useAuthStore.subscribe((state) => {
                if (state.isInitialized) {
                    unsubscribe();
                    resolve();
                }
            });
        });

        // Decide redirect using the latest store state
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            throw redirect({ to: "/dashboard", replace: true });
        }
        throw redirect({ to: "/login", replace: true });
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

    // If there's a critical service error, show error with retry
    // Otherwise, let beforeLoad handle the redirect
    if (initializationError) {
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

    // Fallback UI: by this point beforeLoad should have redirected already
    return <LoadingScreen message="Redirecting..." />;
}
