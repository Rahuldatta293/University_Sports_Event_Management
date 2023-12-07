import {makeApi} from "@zodios/core"
import {z} from "zod"
import {AddressSchema, UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const StadiumSchema = z
	.object({
		id: UuidSchema,
		name: z.string(),
		capacity: z.number().int().min(0),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.merge(AddressSchema)

export type Stadium = z.infer<typeof StadiumSchema>

const CreateStadiumSchema = StadiumSchema.pick({
	name: true,
	capacity: true,
}).merge(AddressSchema)

export type CreateStadium = z.infer<typeof CreateStadiumSchema>

const GetStadiumSchema = StadiumSchema.merge(
	z.object({
		events: z.array(
			z.object({
				id: UuidSchema,
				name: z.string(),
				description: z.string(),
				startDateTime: z.string(),
				endDateTime: z.string(),
				isActive: z.boolean(),
			})
		),
	})
)

export const stadiumApi = makeApi([
	{
		method: "get",
		path: "/Stadium/GetAll",
		alias: "getAllStadiums",
		description: "Get all stadiums",
		response: z.object({
			data: z.array(GetStadiumSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Stadium/:id",
		alias: "getStadiumId",
		description: "Get a stadium",
		response: z.object({
			data: GetStadiumSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/Stadium",
		alias: "createStadium",
		description: "Create a stadium",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "stadium",
				type: "Body",
				schema: CreateStadiumSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/Stadium/:id",
		alias: "updateStadium",
		description: "Update a stadium",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "stadium",
				type: "Body",
				schema: CreateStadiumSchema,
			},
		],
		errors: errors,
	},
])
