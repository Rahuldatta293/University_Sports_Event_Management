import {makeApi} from "@zodios/core"
import {z} from "zod"
import {UuidSchema} from "~/lib/zodios/common"
import {errors} from "~/lib/zodios/error"

export const ReservationSchema = z.object({
	id: UuidSchema,
	seatNumber: z.string(),
	isCancelled: z.boolean(),
	eventId: UuidSchema,
	studentId: UuidSchema,
})

export type Reservation = z.infer<typeof ReservationSchema>

const CreateReservationSchema = ReservationSchema.pick({
	eventId: true,
	studentId: true,
})

export type CreateReservation = z.infer<typeof CreateReservationSchema>

const GetEventReservationSchema = ReservationSchema.pick({
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

const GetStudentReservationSchema = ReservationSchema.pick({
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

export const reservationApi = makeApi([
	{
		method: "get",
		path: "/Reservation/Event/:eventId",
		alias: "getReservationsByEventId",
		description: "Get all reservations by event id",
		response: z.object({
			data: z.array(GetEventReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Reservation/Event/:eventId/active",
		alias: "getActiveReservationsByEventId",
		description: "Get active reservations by event id",
		response: z.object({
			data: z.array(GetEventReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Reservation/Student/:studentId",
		alias: "getReservationsByStudentId",
		description: "Get all reservations by student id",
		response: z.object({
			data: z.array(GetStudentReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "get",
		path: "/Reservation/Student/:studentId/active",
		alias: "getActiveReservationsByStudentId",
		description: "Get active reservations by student id",
		response: z.object({
			data: z.array(GetStudentReservationSchema),
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "delete",
		path: "/Reservation/:reservationId",
		alias: "cancelReservation",
		description: "Cancel a reservation",
		response: z.object({
			data: UuidSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		errors: errors,
	},
	{
		method: "post",
		path: "/Reservation",
		alias: "createReservation",
		description: "Create a reservation",
		response: z.object({
			data: UuidSchema,
			message: z.string(),
			success: z.boolean(),
		}),
		parameters: [
			{
				name: "reservation",
				type: "Body",
				schema: CreateReservationSchema,
			},
		],
		errors: errors,
	},
])
