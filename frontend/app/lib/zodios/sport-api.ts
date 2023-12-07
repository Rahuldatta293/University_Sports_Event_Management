import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const SportSchema = z.object({
	id: UuidSchema,
	name: z.string(),
	description: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type Sport = z.infer<typeof SportSchema>

const CreateSportSchema = SportSchema.pick({
	name: true,
	description: true,
})

export type CreateSport = z.infer<typeof CreateSportSchema>

const GetSportSchema = SportSchema.merge(
	z.object({
		teams: z.array(
			z.object({
				id: UuidSchema,
				name: z.string(),
			})
		),
	})
)

export const sportApi = makeApi([
	{
		method: "get",
		path: "/Sport/GetAll",
		alias: "getAllSports",
		description: "Get all sports",
		response: z.object({
			data: z.array(GetSportSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Sport/:id",
		alias: "getSportById",
		description: "Get a sport",
		response: z.object({
			data: GetSportSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/Sport",
		alias: "createSport",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "sport",
				type: "Body",
				schema: CreateSportSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/Sport/:id",
		alias: "updateSport",
		description: "Update a sport",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "sport",
				type: "Body",
				schema: CreateSportSchema,
			},
		],
		errors: errors,
	},
])
