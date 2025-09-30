import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput, PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { type LoginDTO, loginSchema } from "@/types/auth";

const loginSearchSchema = z.object({
	redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();

		if (isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const { mutateAsync, isPending } = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginDTO>({ resolver: zodResolver(loginSchema) });

	const onSubmit = async (data: LoginDTO) => {
		await mutateAsync(data);

		// Redirect to the page they were trying to access, or dashboard
		const redirectTo = search.redirect || "/dashboard";
		navigate({ to: redirectTo as "/dashboard" });
	};

	return (
		<div className="flex min-h-screen items-center-safe justify-center-safe bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
						Sign in to your account
					</h2>
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
						/>

						<PasswordInput
							{...register("password")}
							placeholder="Enter your password"
							error={errors.password?.message}
							disabled={isPending}
						/>

						<div className="flex items-center-safe justify-between">
							<div className="text-sm">
								<Link
									to="/forgot-password"
									className="text-primary hover:text-primary/80 font-medium hover:underline"
								>
									Forgot your password?
								</Link>
							</div>
						</div>

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
