import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { useAuthContext } from "@/hooks/useAuthContext";
import { AuthProvider } from "@/providers/AuthProvider";
import { routeTree } from "@/routeTree.gen";

// Create the router with proper context typing
const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: This will be populated by the AuthProvider
		auth: undefined!,
	},
	// Add some router-level configuration
	defaultPreload: "intent",
	defaultPreloadStaleTime: 1000 * 60 * 2, // 2 minutes
});

// Register the router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Optimized query client configuration
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Don't retry on auth errors (401/403)
			// biome-ignore lint/suspicious/noExplicitAny: Unknown error type
			retry: (failureCount, error: any) => {
				const status = error?.response?.status;
				if (status === 401 || status === 403) {
					return false;
				}
				return failureCount < 3;
			},
			// Reasonable stale time for better UX
			staleTime: 1000 * 60 * 5, // 5 minutes
			// Don't refetch on window focus during development
			refetchOnWindowFocus: import.meta.env.PROD,
		},
		mutations: {
			// Don't retry mutations by default
			retry: false,
		},
	},
});

// Inner component that provides auth context to router
function RouterWrapper() {
	const auth = useAuthContext();

	// Debug logging
	console.debug("🎯 RouterWrapper auth context:", {
		isAuthenticated: auth.isAuthenticated,
		isInitialized: auth.isInitialized,
		user: auth.user?.email,
		initializationError: auth.initializationError,
	});

	return <RouterProvider router={router} context={{ auth }} />;
}

// Main App component
function App() {
	console.debug("🚀 App component mounting...");

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterWrapper />
				<Toaster
					position="top-right"
					expand={true}
					richColors={true}
					closeButton={true}
				/>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;