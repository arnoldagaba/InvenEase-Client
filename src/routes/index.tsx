import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/")({
	component: IndexComponent,
});

function IndexComponent() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-8">Welcome to My App</h1>

				{isAuthenticated ? (
					<Link
						to="/dashboard"
						className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
					>
						Go to Dashboard
					</Link>
				) : (
					<Link
						to="/login"
						className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
					>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
}
