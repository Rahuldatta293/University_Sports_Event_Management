import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {CreateStadium, Stadium} from "~/lib/zodios/stadium-api"
import {stadiumApi} from "~/lib/zodios/stadium-api"

export async function getStadiumById(id: Stadium["id"]) {
	try {
		const response = await apiClient.getStadiumId({
			params: {id},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(stadiumApi, "getStadiumId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getAllStadiums() {
	try {
		const response = await apiClient.getAllStadiums()

		return response
	} catch (error) {
		if (isErrorFromAlias(stadiumApi, "getAllStadiums", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createStadium(newStadium: CreateStadium) {
	try {
		const response = await apiClient.createStadium(newStadium)
		return response
	} catch (error) {
		if (isErrorFromAlias(stadiumApi, "createStadium", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateStadium(
	id: Stadium["id"],
	updatedData: CreateStadium
) {
	try {
		const response = await apiClient.updateStadium(updatedData, {
			params: {
				id,
			},
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(stadiumApi, "updateStadium", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
