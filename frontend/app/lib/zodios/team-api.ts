import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const TeamSchema = z.object({
	id: UuidSchema,
	name: z.string(),
	sportId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type Team = z.infer<typeof TeamSchema>

const CreateTeamSchema = TeamSchema.pick({
	name: true,
	sportId: true,
})

export type CreateTeam = z.infer<typeof CreateTeamSchema>

const GetTeamSchema = TeamSchema.omit({
	sportId: true,
}).merge(
	z.object({
		sport: z.object({
			id: UuidSchema,
			name: z.string(),
			description: z.string(),
		}),
	})
)

export const teamApi = makeApi([
	{
		method: "get",
		path: "/Team/GetAll",
		alias: "getAllTeams",
		description: "Get all teams",
		response: z.object({
			data: z.array(GetTeamSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Team/GetById/:id",
		alias: "getTeamById",
		description: "Get a team",
		response: z.object({
			data: GetTeamSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Team/GetTeamsBySportId/:sportId",
		alias: "getTeamsBySportId",
		description: "Get teams by sport id",
		response: z.object({
			data: z.array(GetTeamSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/Team",
		alias: "createTeam",
		description: "Create a team",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "user",
				type: "Body",
				schema: CreateTeamSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/Team/:id",
		alias: "updateTeam",
		description: "Update a team",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "update-team",
				type: "Body",
				schema: CreateTeamSchema,
			},
		],
		errors: errors,
	},
])
