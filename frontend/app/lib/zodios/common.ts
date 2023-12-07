import {z} from "zod"

export const UuidSchema = z.string()

export const AddressSchema = z.object({
	addressLine1: z.string().min(1, {message: "Address line 1 is required"}),
	addressLine2: z.string().optional(),
	city: z.string().min(1, {message: "City is required"}),
	state: z.string().min(1, {message: "State is required"}),
	zipCode: z.string().min(1, {message: "Zip is required"}),
})
