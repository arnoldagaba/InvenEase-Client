import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { useAuthContext } from "./hooks/useAuthContext";
import { AuthProvider } from "./providers/AuthProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: We know it exists
		auth: undefined!,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 5 * 60 * 1_000,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

// Inner component that provides auth context to router
function InnerApp() {
	const auth = useAuthContext();

	return (
		<>
			<RouterProvider router={router} context={{ auth }} />
			<Toaster position="top-right" />
		</>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<InnerApp />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
