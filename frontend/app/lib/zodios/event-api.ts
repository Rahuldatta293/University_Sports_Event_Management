import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema, AddressSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const EventSchema = z.object({
	id: UuidSchema,
	name: z.string(),
	description: z.string(),
	startDateTime: z.string(),
	endDateTime: z.string(),
	sportId: z.string(),
	isActive: z.boolean(),
	stadiumId: z.string(),
	teamOneId: z.string(),
	teamTwoId: z.string(),
	organizerId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type Event = z.infer<typeof EventSchema>

const CreateEventSchema = EventSchema.pick({
	name: true,
	description: true,
	startDateTime: true,
	endDateTime: true,
	sportId: true,
	stadiumId: true,
	teamOneId: true,
	teamTwoId: true,
	organizerId: true,
})

export type CreateEvent = z.infer<typeof CreateEventSchema>

const GetEventSchema = EventSchema.omit({
	sportId: true,
	teamOneId: true,
	teamTwoId: true,
	stadiumId: true,
	organizerId: true,
}).merge(
	z.object({
		capacity: z.number().int(),
		reservedSeats: z.number().int(),
		sport: z.object({
			id: UuidSchema,
			name: z.string(),
			description: z.string(),
		}),
		teamOne: z.object({
			id: UuidSchema,
			name: z.string(),
		}),
		teamTwo: z.object({
			id: UuidSchema,
			name: z.string(),
		}),
		stadium: z
			.object({
				id: UuidSchema,
				name: z.string(),
				capacity: z.number(),
			})
			.merge(AddressSchema),
		organizer: z.object({
			id: UuidSchema,
			name: z.string(),
			email: z.string().email(),
			role: z.number(),
			isActive: z.boolean(),
		}),
	})
)

const UpdateEventSchema = EventSchema.pick({
	name: true,
	description: true,
	startDateTime: true,
	endDateTime: true,
})

export type UpdateEvent = z.infer<typeof UpdateEventSchema>

export const eventApi = makeApi([
	{
		method: "get",
		path: "/Event/GetAll",
		alias: "getAllEvents",
		description: "Get all events",
		response: z.object({
			data: z.array(GetEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Event/GetById/:id",
		alias: "getEventById",
		description: "Get a event by id",
		response: z.object({
			data: GetEventSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Event/GetEventsBySportId/:sportId",
		alias: "getEventsBySportId",
		description: "Get events by sport id",
		response: z.object({
			data: z.array(GetEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Event/GetEventsByOrganizerId/:organizerId",
		alias: "getEventsByOrganizerId",
		description: "Get events by organizer id",
		response: z.object({
			data: z.array(GetEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Event/GetEventsByTeamId/:teamId",
		alias: "getEventsByTeamId",
		description: "Get events by team id",
		response: z.object({
			data: z.array(GetEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Event/GetEventsByStadiumId/:stadiumId",
		alias: "getEventsByStadiumId",
		description: "Get events by stadium id",
		response: z.object({
			data: z.array(GetEventSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/Event",
		alias: "createEvent",
		description: "Create an event",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "event",
				type: "Body",
				schema: CreateEventSchema,
			},
		],
		errors: errors,
	},
	{
		method: "put",
		path: "/Event/:id",
		alias: "updateEvent",
		description: "Update an event",
		response: z.object({
			data: UuidSchema.nullable(),
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "update-event",
				type: "Body",
				schema: UpdateEventSchema,
			},
		],
		errors: errors,
	},
	{
		method: "delete",
		path: "/Event/:id",
		alias: "cancelEvent",
		description: "Cancel an event",
		response: z.object({
			data: z.boolean(),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
])
