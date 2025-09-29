import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface RouterContext {
	isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<div className="min-h-screen bg-gray-50">
				<Outlet />
			</div>

			<TanStackRouterDevtools initialIsOpen={false} position="bottom-right" />
		</>
	);
}
