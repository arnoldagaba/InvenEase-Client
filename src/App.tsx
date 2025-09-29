import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./providers/AuthProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	context: {
		isAuthenticated: false,
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

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
				<Toaster position="top-right" />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
