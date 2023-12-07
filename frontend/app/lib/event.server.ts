import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {CreateEvent, Event, UpdateEvent} from "~/lib/zodios/event-api"
import {eventApi} from "~/lib/zodios/event-api"
import type {Stadium} from "~/lib/zodios/stadium-api"
import type {Team} from "~/lib/zodios/team-api"
import type {User} from "~/lib/zodios/user-api"

export async function getEventById(id: Event["id"]) {
	try {
		const response = await apiClient.getEventById({
			params: {id},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getEventById", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getEventsBySportId(sportId: Event["sportId"]) {
	try {
		const response = await apiClient.getEventsBySportId({
			params: {
				sportId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getEventsBySportId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getEventsByTeamId(teamId: Team["id"]) {
	try {
		const response = await apiClient.getEventsByTeamId({
			params: {
				teamId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getEventsByTeamId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getEventsByStadiumId(stadiumId: Stadium["id"]) {
	try {
		const response = await apiClient.getEventsByStadiumId({
			params: {
				stadiumId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getEventsByStadiumId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getEventsByOrganizerId(organizerId: User["id"]) {
	try {
		const response = await apiClient.getEventsByOrganizerId({
			params: {
				organizerId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getEventsByOrganizerId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getAllEvents() {
	try {
		const response = await apiClient.getAllEvents()
		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "getAllEvents", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createEvent(newEvent: CreateEvent) {
	try {
		const response = await apiClient.createEvent(newEvent)
		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "createEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateEvent(id: Event["id"], newEvent: UpdateEvent) {
	try {
		const response = await apiClient.updateEvent(
			{
				name: newEvent.name,
				description: newEvent.description,
				endDateTime: newEvent.endDateTime,
				startDateTime: newEvent.startDateTime,
			},
			{
				params: {
					id,
				},
			}
		)
		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "updateEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function cancelEvent(id: Event["id"]) {
	try {
		const response = await apiClient.cancelEvent(undefined, {
			params: {
				id,
			},
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(eventApi, "cancelEvent", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
