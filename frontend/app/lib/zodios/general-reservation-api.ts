import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const GeneralReservationSchema = z.object({
	id: UuidSchema,
	seatNumber: z.string(),
	isCancelled: z.boolean(),
	eventId: UuidSchema,
	studentId: UuidSchema,
})

export type GeneralReservation = z.infer<typeof GeneralReservationSchema>

const CreateGeneralReservationSchema = GeneralReservationSchema.pick({
	eventId: true,
	studentId: true,
})

export type CreateGeneralReservation = z.infer<
	typeof CreateGeneralReservationSchema
>

const GetEventGeneralReservationSchema = GeneralReservationSchema.pick({
	id: true,
	seatNumber: true,
	isCancelled: true,
}).merge(
	z.object({
		event: z.object({
			id: UuidSchema,
			name: z.string(),
			description: z.string(),
			startDateTime: z.string(),
			endDateTime: z.string(),
			isActive: z.boolean(),
		}),
		student: z.object({
			id: UuidSchema,
			name: z.string(),
			email: z.string().email(),
			role: z.number(),
			isActive: z.boolean(),
		}),
	})
)

const GetStudentGeneralReservationSchema = GeneralReservationSchema.pick({
	id: true,
	seatNumber: true,
	isCancelled: true,
}).merge(
	z.object({
		event: z.object({
			id: UuidSchema,
			name: z.string(),
			description: z.string(),
			startDateTime: z.string(),
			endDateTime: z.string(),
		}),
	})
)

export const generalReservationApi = makeApi([
	{
		method: "get",
		path: "/GeneralReservation/Event/:eventId",
		alias: "getGeneralReservationsByEventId",
		description: "Get all general reservations by event id",
		response: z.object({
			data: z.array(GetEventGeneralReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/GeneralReservation/Event/:eventId/active",
		alias: "getActiveGeneralReservationsByEventId",
		description: "Get active general reservations by event id",
		response: z.object({
			data: z.array(GetEventGeneralReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/GeneralReservation/Student/:studentId",
		alias: "getGeneralReservationsByStudentId",
		description: "Get all general reservations by student id",
		response: z.object({
			data: z.array(GetStudentGeneralReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/GeneralReservation/Student/:studentId/active",
		alias: "getActiveGeneralReservationsByStudentId",
		description: "Get active general reservations by student id",
		response: z.object({
			data: z.array(GetStudentGeneralReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "delete",
		path: "/GeneralReservation/:reservationId",
		alias: "cancelGeneralReservation",
		description: "Cancel a general reservation",
		response: z.object({
			data: UuidSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/GeneralReservation",
		alias: "createGeneralReservation",
		description: "Create a general reservation",
		response: z.object({
			data: UuidSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "general-reservation",
				type: "Body",
				schema: CreateGeneralReservationSchema,
			},
		],
		errors: errors,
	},
])
