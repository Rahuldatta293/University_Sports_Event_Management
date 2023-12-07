import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {badRequest} from "remix-utils"
import {z} from "zod"
import {updateUser} from "~/lib/user.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const EditUserSchema = z
	.object({
		userId: z.string().nonempty("User ID is required"),
		role: z.string().min(1, "Role is required").transform(Number),
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email"),
		password: z.string().optional(),
		addressLine1: z.string().min(1, "Address Line 1 is required"),
		addressLine2: z.string().optional(),
		city: z.string().min(1, "City is required"),
		state: z.string().min(1, "State is required"),
		zipCode: z.string().min(1, "Zip Code is required"),
		isActive: z.enum(["on"]).optional(),
	})
	.superRefine((data, ctx) => {
		if (data.password && data.password.length < 7) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Password must be at least 7 characters",
				path: ["password"],
			})
		}
	})

export interface EditUserActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof EditUserSchema>
}

export const action = async ({request}: DataFunctionArgs) => {
	const {fields, fieldErrors} = await validateAction(request, EditUserSchema)

	if (fieldErrors) {
		return badRequest<EditUserActionData>({success: false, fieldErrors})
	}

	const updateUserResponse = await updateUser(fields.userId, {
		...fields,
		isActive: fields.isActive === "on",
	})

	if (!updateUserResponse.success) {
		return badRequest<EditUserActionData>({
			success: false,
			fieldErrors: {
				userId: updateUserResponse.message,
			},
		})
	}

	return json({success: true, message: "Update successfull!"})
}
