import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {badRequest} from "remix-utils"
import {z} from "zod"
import {cancelEvent} from "~/lib/event.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const CancelEventSchema = z.object({
	eventId: z.string().nonempty("Event ID is required"),
})

export interface CancelEventActionData {
	success: boolean
	fieldErrors?: inferErrors<typeof CancelEventSchema>
}

export const action = async ({request}: DataFunctionArgs) => {
	const {fields, fieldErrors} = await validateAction(request, CancelEventSchema)

	if (fieldErrors) {
		return badRequest<CancelEventActionData>({success: false, fieldErrors})
	}

	const cancelEventResponse = await cancelEvent(fields.eventId)

	if (!cancelEventResponse.success) {
		return badRequest<CancelEventActionData>({
			success: false,
			fieldErrors: {
				eventId: cancelEventResponse.message,
			},
		})
	}

	return json({success: true})
}
