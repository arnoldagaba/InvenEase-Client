import z from "zod";

import { emailSchema, passwordSchema } from "./auth";

export const UpdateUserSchema = z.object({
	email: emailSchema.optional(),
	password: passwordSchema.optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	roleId: z.string().optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
