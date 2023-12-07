import {isErrorFromAlias} from "@zodios/core"
import type {z} from "zod"
import {apiClient} from "~/lib/zodios/api-client.server"
import {authApi} from "~/lib/zodios/auth-api"
import type {
	CreateUserSchema,
	ResetPasswordType,
	UpdateUserType,
	User,
} from "~/lib/zodios/user-api"
import {userApi} from "~/lib/zodios/user-api"
import type {UserRole} from "~/utils/constants"

export const BACKEND_API_URL = process.env.BACKEND_API_URL!

export async function getAllUsers() {
	try {
		const response = await apiClient.getAllUsers()

		return response
	} catch (error) {
		if (isErrorFromAlias(userApi, "getAllUsers", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function getUserById(id: string) {
	try {
		const response = await apiClient.getUserById({
			params: {id},
		})

		return response.data
	} catch (error) {
		if (isErrorFromAlias(userApi, "getUserById", error)) {
			console.log("error", error.response.data)
			return null
		}

		throw error
	}
}

export async function verifyLogin({
	email,
	password,
	role,
}: {
	email: string
	password: string
	role: UserRole
}) {
	try {
		const response = await apiClient.verifyLogin({
			email,
			password,
			role,
		})

		return response
	} catch (error) {
		if (isErrorFromAlias(authApi, "verifyLogin", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function createUser(userData: z.infer<typeof CreateUserSchema>) {
	try {
		const response = await apiClient.createUser(userData)

		return response
	} catch (error) {
		if (isErrorFromAlias(userApi, "createUser", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function updateUser(id: User["id"], updatedUser: UpdateUserType) {
	try {
		const response = await apiClient.updateUser(updatedUser, {
			params: {
				id,
			},
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(userApi, "updateUser", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function sendResetPasswordEmail(email: string) {
	try {
		const response = await apiClient.sendResetPasswordEmail({
			email,
		})
		return response
	} catch (error) {
		if (isErrorFromAlias(authApi, "sendResetPasswordEmail", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}

export async function resetPassword(data: ResetPasswordType) {
	try {
		const response = await apiClient.resetPassword(data)
		return response
	} catch (error) {
		if (isErrorFromAlias(userApi, "resetPassword", error)) {
			console.log("error", error.response.data)
			return error.response.data
		}

		throw error
	}
}
