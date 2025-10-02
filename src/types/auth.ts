import { z } from "zod";

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	lastLoginAt: Date | null;
	roleId: string;
	role: {
		id: string;
		name: string;
		permissions: Array<{
			roleId: string;
			permissionId: string;
			permission?: {
				id: string;
				createdAt: Date;
				updatedAt?: Date;
				name: string;
				description: string | null;
				category: string;
			};
		}>;
	};
	createdAt: Date;
	updatedAt: Date;
}

export const emailSchema = z
	.email("Please provide a valid email address")
	.toLowerCase()
	.trim();
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/\d/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
	.object({
		currentPassword: passwordSchema,
		newPassword: passwordSchema,
		confirmNewPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.newPassword === data.currentPassword) {
			ctx.addIssue({
				code: "custom",
				message: "New password must be different from current password",
				path: ["newPassword"],
			});
		}
		if (data.newPassword !== data.confirmNewPassword) {
			ctx.addIssue({
				code: "custom",
				message: "New password and confirmation do not match",
				path: ["confirmNewPassword"],
			});
		}
	});
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
