import {makeApi} from "@zodios/core"
import {z} from "zod"
import {AddressSchema, UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const GeneralEventSchema = z
	.object({
		id: UuidSchema,
		name: z.string(),
		description: z.string(),
		startDateTime: z.string(),
		capacity: z.number().int().min(0),
		endDateTime: z.string(),
		isActive: z.boolean(),
		organizerId: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.merge(AddressSchema)

export type GeneralEvent = z.infer<typeof GeneralEventSchema>

const CreateGeneralEventSchema = GeneralEventSchema.pick({
	name: true,
	description: true,
	startDateTime: true,
	endDateTime: true,
	capacity: true,
	organizerId: true,
}).merge(AddressSchema)

export type CreateGeneralEvent = z.infer<typeof CreateGeneralEventSchema>

const GetGeneralEventSchema = GeneralEventSchema.omit({
	organizerId: true,
}).merge(
	z.object({
		capacity: z.number().int(),
		reservedSeats: z.number().int(),
		organizer: z.object({
			id: UuidSchema,
			name: z.string(),
			email: z.string().email(),
			role: z.number(),
			isActive: z.boolean(),
		}),
	})
)

const UpdateGeneralEventSchema = GeneralEventSchema.pick({
	name: true,
	description: true,
	startDateTime: true,
	endDateTime: true,
	capacity: true,
}).merge(AddressSchema)

export type UpdateGeneralEvent = z.infer<typeof UpdateGeneralEventSchema>

export const generalEventApi = makeApi([
	{
		method: "get",
		path: "/GeneralEvent/GetAll",
		alias: "getAllGeneralEvents",
		description: "Get all general events",
		response: z.object({
			data: z.array(GetGeneralEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/GeneralEvent/GetById/:id",
		alias: "getGeneralEventById",
		description: "Get a general event by id",
		response: z.object({
			data: GetGeneralEventSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/GeneralEvent/GetEventsByOrganizerId/:organizerId",
		alias: "getGeneralEventsByOrganizerId",
		description: "Get general events by organizer id",
		response: z.object({
			data: z.array(GetGeneralEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/GeneralEvent",
		alias: "createGeneralEvent",
		description: "Create a general event",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "event",
				type: "Body",
				schema: CreateGeneralEventSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/GeneralEvent/:id",
		alias: "updateGeneralEvent",
		description: "Update a general event",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "update-general-event",
				type: "Body",
				schema: UpdateGeneralEventSchema,
			},
		],
		errors: errors,
	},
	{
		method: "delete",
		path: "/GeneralEvent/:id",
		alias: "cancelGeneralEvent",
		description: "Cancel a general event",
		response: z.object({
			data: z.boolean(),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
])
