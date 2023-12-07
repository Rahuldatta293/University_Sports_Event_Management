import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {CreateSport, Sport} from "~/lib/zodios/sport-api"
import {sportApi} from "~/lib/zodios/sport-api"

export async function getSportById(id: Sport["id"]) {
	try {
		const response = await apiClient.getSportById({
			params: {id},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(sportApi, "getSportById", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getAllSports() {
	try {
		const response = await apiClient.getAllSports()

		return response
	} catch (error) {
		if (isErrorFromAlias(sportApi, "getAllSports", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createSport(newSport: CreateSport) {
	try {
		const response = await apiClient.createSport({
			name: newSport.name,
			description: newSport.description,
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(sportApi, "createSport", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateSport(id: Sport["id"], newSport: CreateSport) {
	try {
		const response = await apiClient.updateSport(
			{
				name: newSport.name,
				description: newSport.description,
			},
			{
				params: {
					id,
				},
			}
		)
		return response
	} catch (error) {
		if (isErrorFromAlias(sportApi, "updateSport", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
