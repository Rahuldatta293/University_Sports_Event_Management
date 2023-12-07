import {isErrorFromAlias} from "@zodios/core"
import {apiClient} from "~/lib/zodios/api-client.server"
import type {CreateTeam, Team} from "~/lib/zodios/team-api"
import {teamApi} from "~/lib/zodios/team-api"

export async function getTeamById(id: Team["id"]) {
	try {
		const response = await apiClient.getTeamById({
			params: {id},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(teamApi, "getTeamById", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getTeamsBySportId(sportId: Team["sportId"]) {
	try {
		const response = await apiClient.getTeamsBySportId({
			params: {
				sportId,
			},
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(teamApi, "getTeamsBySportId", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getAllTeams() {
	try {
		const response = await apiClient.getAllTeams()

		return response
	} catch (error) {
		if (isErrorFromAlias(teamApi, "getAllTeams", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createTeam(newTeam: CreateTeam) {
	try {
		const response = await apiClient.createTeam({
			name: newTeam.name,
			sportId: newTeam.sportId,
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(teamApi, "createTeam", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateTeam(id: Team["id"], newTeam: CreateTeam) {
	try {
		const response = await apiClient.updateTeam(
			{
				name: newTeam.name,
				sportId: newTeam.sportId,
			},
			{
				params: {
					id,
				},
			}
		)
		return response
	} catch (error) {
		if (isErrorFromAlias(teamApi, "updateTeam", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
