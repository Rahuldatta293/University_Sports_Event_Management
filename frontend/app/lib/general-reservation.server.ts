import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {GeneralEvent} from "~/lib/zodios/general-event-api"
import type {
	CreateGeneralReservation,
	GeneralReservation,
} from "~/lib/zodios/general-reservation-api"
import {generalReservationApi} from "~/lib/zodios/general-reservation-api"
import type {User} from "~/lib/zodios/user-api"

export async function getGeneralReservationsByEventId(
	eventId: GeneralEvent["id"]
) {
	try {
		const response = await apiClient.getGeneralReservationsByEventId({
			params: {
				eventId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(
				generalReservationApi,
				"getGeneralReservationsByEventId",
				error
			)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getActiveGeneralReservationsByEventId(
	eventId: GeneralEvent["id"]
) {
	try {
		const response = await apiClient.getActiveReservationsByEventId({
			params: {
				eventId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(
				generalReservationApi,
				"getActiveGeneralReservationsByEventId",
				error
			)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getGeneralReservationsByStudentId(studentId: User["id"]) {
	try {
		const response = await apiClient.getGeneralReservationsByStudentId({
			params: {
				studentId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(
				generalReservationApi,
				"getGeneralReservationsByStudentId",
				error
			)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getActiveGeneralReservationsByStudentId(
	studentId: User["id"]
) {
	try {
		const response = await apiClient.getActiveGeneralReservationsByStudentId({
			params: {
				studentId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(
				generalReservationApi,
				"getActiveGeneralReservationsByStudentId",
				error
			)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createGeneralReservation(
	newReservation: CreateGeneralReservation
) {
	try {
		const response = await apiClient.createGeneralReservation(newReservation)
		return response
	} catch (error) {
		if (
			isErrorFromAlias(generalReservationApi, "createGeneralReservation", error)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw new Error("Something went wrong")
	}
}

export async function cancelGeneralReservation(
	reservationId: GeneralReservation["id"]
) {
	try {
		const response = await apiClient.cancelGeneralReservation(undefined, {
			params: {
				reservationId,
			},
		})
		return response
	} catch (error) {
		if (
			isErrorFromAlias(generalReservationApi, "cancelGeneralReservation", error)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
