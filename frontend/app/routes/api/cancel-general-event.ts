import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {badRequest} from "remix-utils"
import {z} from "zod"
import {cancelGeneralEvent} from "~/lib/general-event.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const CancelGeneralEventSchema = z.object({
	eventId: z.string().nonempty("Event ID is required"),
})

export interface CancelGeneralEventActionData {
	success: boolean
	fieldErrors?: inferErrors<typeof CancelGeneralEventSchema>
}

export const action = async ({request}: DataFunctionArgs) => {
	const {fields, fieldErrors} = await validateAction(
		request,
		CancelGeneralEventSchema
	)

	if (fieldErrors) {
		return badRequest<CancelGeneralEventActionData>({
			success: false,
			fieldErrors,
		})
	}

	const cancelEventResponse = await cancelGeneralEvent(fields.eventId)

	if (!cancelEventResponse.success) {
		return badRequest<CancelGeneralEventActionData>({
			success: false,
			fieldErrors: {
				eventId: cancelEventResponse.message,
			},
		})
	}

	return json({success: true})
}
