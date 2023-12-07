import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {badRequest} from "remix-utils"
import {z} from "zod"
import {cancelReservation} from "~/lib/reservation.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const CancelReservationSchema = z.object({
	reservationId: z.string().nonempty("Reservation ID is required"),
})

export interface CancelReservationActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof CancelReservationSchema>
}

export const action = async ({request}: DataFunctionArgs) => {
	const {fields, fieldErrors} = await validateAction(
		request,
		CancelReservationSchema
	)

	if (fieldErrors) {
		return badRequest<CancelReservationActionData>({
			success: false,
			message: "Invalid request",
			fieldErrors,
		})
	}

	const cancelReservationResponse = await cancelReservation(
		fields.reservationId
	)

	if (!cancelReservationResponse.success) {
		return badRequest<CancelReservationActionData>({
			success: false,
			message: "Invalid request",
			fieldErrors: {
				reservationId: cancelReservationResponse.message,
			},
		})
	}

	return json({success: true, message: "Reservation cancelled"})
}
