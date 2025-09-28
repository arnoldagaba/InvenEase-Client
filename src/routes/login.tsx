import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	redirect,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput, PasswordInput } from "@/components/forms";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useAuth";
import { type LoginDTO, loginSchema } from "@/types/auth";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context, search }) => {
		// Wait for auth initialization if not complete
		if (!context.auth.isInitialized) {
			await new Promise<void>((resolve) => {
				const checkInitialization = () => {
					if (context.auth.isInitialized) {
						resolve();
					} else {
						setTimeout(checkInitialization, 10);
					}
				};
				checkInitialization();
			});
		}

		// If user is already authenticated, redirect them away from login
		if (context.auth.isAuthenticated) {
			console.debug(
				"✅ User already authenticated, redirecting away from login",
			);

			// If there's a redirect URL, use it, otherwise go to dashboard
			const redirectTo =
				(search as { redirect?: string })?.redirect || "/dashboard";

			throw redirect({
				to: redirectTo,
				replace: true,
			});
		}

		console.debug("🔓 User not authenticated, showing login page");
	},
	component: LoginPage,
	validateSearch: loginSearchSchema,
});

function LoginPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const { redirect } = search;
	const { mutateAsync, isPending } = useLogin();
	const { isInitialized, initializationError, setInitializationError } = Route.useRouteContext().auth;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginDTO>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Show loading during initialization
	if (!isInitialized) {
		return <LoadingScreen message="Loading..." />;
	}

	// Show error only for critical service failures (500+ errors)
	// For other errors, proceed to show login form
	if (initializationError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4 max-w-md">
					<div className="text-red-500 text-lg font-medium">
						Service Unavailable
					</div>
					<p className="text-gray-600">{initializationError}</p>
					<div className="space-x-2">
						<button type="button"
							onClick={() => window.location.reload()}
							className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
						>
							Retry
						</button>
						<button type="button"
							onClick={() => setInitializationError(null)}
							className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
						>
							Continue to Login
						</button>
					</div>
				</div>
			</div>
		);
	}

	const onSubmit = async (data: LoginDTO) => {
		try {
			await mutateAsync(data);

			// After successful login, redirect to intended page or dashboard
			if (redirect) {
				console.debug("🎯 Redirecting to intended page:", redirect);
				window.location.href = redirect; // Use window.location for full redirect
			} else {
				console.debug("🎯 Redirecting to dashboard");
				navigate({ to: "/dashboard", replace: true });
			}
		} catch (error) {
			// Error handling is done in the hook
			console.debug("❌ Login failed", error);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
						Sign in to your account
					</h2>
					{redirect && (
						<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
							Please sign in to continue to your requested page
						</p>
					)}
				</div>

				<div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<FormInput
							{...register("email")}
							label="Email address"
							type="email"
							icon={Mail}
							placeholder="Enter your email"
							error={errors.email?.message}
							disabled={isPending}
							autoComplete="email"
							autoFocus
						/>

						<PasswordInput
							{...register("password")}
							placeholder="Enter your password"
							error={errors.password?.message}
							disabled={isPending}
							autoComplete="current-password"
						/>

						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}