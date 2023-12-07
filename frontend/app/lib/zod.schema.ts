import {z} from "zod"

export const LoginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().trim().min(1, "Password is required"),
	remember: z.enum(["on"]).optional(),
	role: z.preprocess(Number, z.number().int().min(1).max(4)),
	redirectTo: z.string().default("/"),
})

export const RegisterUserSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email"),
		password: z.string().trim().min(1, "Password is required"),
		confirmPassword: z.string().trim().min(1, "Password is required"),
		addressLine1: z.string().min(1, "Address Line 1 is required"),
		addressLine2: z.string().optional(),
		city: z.string().min(1, "City is required"),
		state: z.string().min(1, "State is required"),
		zipCode: z.string().min(1, "Zip Code is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["password", "confirmPassword"],
	})
