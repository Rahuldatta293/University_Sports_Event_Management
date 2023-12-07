import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {Event} from "~/lib/zodios/event-api"
import type {CreateReservation, Reservation} from "~/lib/zodios/reservation-api"
import {reservationApi} from "~/lib/zodios/reservation-api"
import type {User} from "~/lib/zodios/user-api"

export async function getReservationsByEventId(eventId: Event["id"]) {
	try {
		const response = await apiClient.getReservationsByEventId({
			params: {
				eventId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(reservationApi, "getReservationsByEventId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getActiveReservationsByEventId(eventId: Event["id"]) {
	try {
		const response = await apiClient.getActiveReservationsByEventId({
			params: {
				eventId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(reservationApi, "getActiveReservationsByEventId", error)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getReservationsByStudentId(studentId: User["id"]) {
	try {
		const response = await apiClient.getReservationsByStudentId({
			params: {
				studentId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(reservationApi, "getReservationsByStudentId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
export async function getActiveReservationsByStudentId(studentId: User["id"]) {
	try {
		const response = await apiClient.getActiveReservationsByStudentId({
			params: {
				studentId,
			},
		})

		return response
	} catch (error) {
		if (
			isErrorFromAlias(
				reservationApi,
				"getActiveReservationsByStudentId",
				error
			)
		) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createReservation(newReservation: CreateReservation) {
	try {
		const response = await apiClient.createReservation(newReservation)
		return response
	} catch (error) {
		if (isErrorFromAlias(reservationApi, "createReservation", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw new Error("Something went wrong")
	}
}

export async function cancelReservation(reservationId: Reservation["id"]) {
	try {
		const response = await apiClient.cancelReservation(undefined, {
			params: {
				reservationId,
			},
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(reservationApi, "cancelReservation", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
