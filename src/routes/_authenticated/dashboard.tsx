import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
	beforeLoad: () => ({
		crumb: "Dashboard",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/dashboard"!</div>;
}
