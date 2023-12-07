import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {badRequest} from "remix-utils"
import {z} from "zod"
import {cancelGeneralReservation} from "~/lib/general-reservation.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const CancelGeneralReservationSchema = z.object({
	reservationId: z.string().nonempty("Reservation ID is required"),
})

export interface CancelGeneralReservationActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof CancelGeneralReservationSchema>
}

export const action = async ({request}: DataFunctionArgs) => {
	const {fields, fieldErrors} = await validateAction(
		request,
		CancelGeneralReservationSchema
	)

	if (fieldErrors) {
		return badRequest<CancelGeneralReservationActionData>({
			success: false,
			message: "Invalid request",
			fieldErrors,
		})
	}

	const cancelReservationResponse = await cancelGeneralReservation(
		fields.reservationId
	)

	if (!cancelReservationResponse.success) {
		return badRequest<CancelGeneralReservationActionData>({
			success: false,
			message: "Invalid request",
			fieldErrors: {
				reservationId: cancelReservationResponse.message,
			},
		})
	}

	return json({success: true, message: "Reservation cancelled"})
}
