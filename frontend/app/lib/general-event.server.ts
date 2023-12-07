import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {
	CreateGeneralEvent,
	GeneralEvent,
	UpdateGeneralEvent,
} from "~/lib/zodios/general-event-api"
import {generalEventApi} from "~/lib/zodios/general-event-api"
import type {User} from "~/lib/zodios/user-api"

export async function getGeneralEventById(id: GeneralEvent["id"]) {
	try {
		const response = await apiClient.getGeneralEventById({
			params: {id},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(generalEventApi, "getGeneralEventById", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getGeneralEventsByOrganizerId(organizerId: User["id"]) {
	try {
		const response = await apiClient.getGeneralEventsByOrganizerId({
			params: {
				organizerId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(generalEventApi, "getGeneralEventsByOrganizerId", error)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getAllGeneralEvents() {
	try {
		const response = await apiClient.getAllGeneralEvents()
		return response
	} catch (error) {
		if (isErrorFromAlias(generalEventApi, "getAllGeneralEvents", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createGeneralEvent(newEvent: CreateGeneralEvent) {
	try {
		const response = await apiClient.createGeneralEvent(newEvent)
		return response
	} catch (error) {
		if (isErrorFromAlias(generalEventApi, "createGeneralEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateGeneralEvent(
	id: GeneralEvent["id"],
	newEvent: UpdateGeneralEvent
) {
	try {
		const response = await apiClient.updateGeneralEvent(
			{
				name: newEvent.name,
				description: newEvent.description,
				endDateTime: newEvent.endDateTime,
				startDateTime: newEvent.startDateTime,
				capacity: newEvent.capacity,
				addressLine1: newEvent.addressLine1,
				addressLine2: newEvent.addressLine2,
				city: newEvent.city,
				state: newEvent.state,
				zipCode: newEvent.zipCode,
			},
			{
				params: {
					id,
				},
			}
		)
		return response
	} catch (error) {
		if (isErrorFromAlias(generalEventApi, "updateGeneralEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function cancelGeneralEvent(id: GeneralEvent["id"]) {
	try {
		const response = await apiClient.cancelGeneralEvent(undefined, {
			params: {
				id,
			},
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(generalEventApi, "cancelGeneralEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
