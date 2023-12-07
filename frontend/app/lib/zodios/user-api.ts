import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

const UserSchema = z.object({
	id: UuidSchema,
	name: z.string(),
	email: z.string().email(),
	role: z.number().int().min(1).max(4),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	password: z.string(),
})

const UserAddressSchema = z.object({
	addressLine1: z.string().min(1, {message: "Address line 1 is required"}),
	addressLine2: z.string().optional(),
	city: z.string().min(1, {message: "City is required"}),
	state: z.string().min(1, {message: "State is required"}),
	zipCode: z.string().min(1, {message: "Zip is required"}),
})

export type User = z.infer<typeof UserSchema>

const GetUserSchema = UserSchema.omit({password: true}).merge(UserAddressSchema)
export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isActive: true,
}).merge(UserAddressSchema)

export const UpdateUserSchema = UserSchema.pick({
	name: true,
	email: true,
	role: true,
	isActive: true,
})
	.merge(
		z.object({
			password: z.string().optional(),
		})
	)
	.merge(UserAddressSchema)

const ResetPasswordSchema = UserSchema.pick({
	email: true,
	password: true,
}).merge(
	z.object({
		token: z.string(),
	})
)

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
export type UpdateUserType = z.infer<typeof UpdateUserSchema>

export const userApi = makeApi([
	{
		method: "get",
		path: "/User/GetAll",
		alias: "getAllUsers",
		description: "Get all users",
		response: z.object({
			data: z.array(GetUserSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/User/:id",
		alias: "getUserById",
		description: "Get a user",
		response: z.object({
			data: GetUserSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/User",
		alias: "createUser",
		description: "Create a user",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "user",
				type: "Body",
				schema: CreateUserSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/User/:id",
		alias: "updateUser",
		description: "Update a user",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "user",
				type: "Body",
				schema: UpdateUserSchema,
			},
		],
		errors: errors,
	},
	{
		method: "post",
		path: "/User/ResetPassword",
		alias: "resetPassword",
		description: "Reset a user's password",
		response: z.object({
			data: z.boolean(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "reset-password",
				type: "Body",
				schema: ResetPasswordSchema,
			},
		],
		errors: errors,
	},
])
