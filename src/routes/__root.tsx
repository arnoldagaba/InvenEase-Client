import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
	<>
		<div className="min-h-screen bg-gray-50">
			<Outlet />
		</div>

		{/* Development tools */}
		{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		<TanStackRouterDevtools position="bottom-right" />
	</>
);

export const Route = createRootRoute({ component: RootLayout });
