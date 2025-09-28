import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { User } from "@/types/auth";

// Define the router context interface
interface RouterContext {
	auth: {
		isAuthenticated: boolean;
		isInitialized: boolean;
		user: User | null;
		initializationError: string | null;
	};
}

const RootLayout = () => (
	<>
		<div className="min-h-screen bg-background">
			<Outlet />
		</div>

		{/* Development tools - only in development */}
		{import.meta.env.DEV && (
			<>
				<ReactQueryDevtools initialIsOpen={false} />
				<TanStackRouterDevtools position="bottom-right" />
			</>
		)}
	</>
);

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});
