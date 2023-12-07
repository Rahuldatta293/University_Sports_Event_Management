import {Zodios} from "@zodios/core"
import invariant from "tiny-invariant"
import {authApi} from "~/lib/zodios/auth-api"
import {eventApi} from "~/lib/zodios/event-api"
import {generalEventApi} from "~/lib/zodios/general-event-api"
import {generalReservationApi} from "~/lib/zodios/general-reservation-api"
import {reservationApi} from "~/lib/zodios/reservation-api"
import {sportApi} from "~/lib/zodios/sport-api"
import {stadiumApi} from "~/lib/zodios/stadium-api"
import {teamApi} from "~/lib/zodios/team-api"
import {userApi} from "~/lib/zodios/user-api"

const BASE_URL = process.env.BACKEND_API_URL
invariant(BASE_URL, "BACKEND_API_URL env var is required")

export const apiClient = new Zodios(BASE_URL, [
	...userApi,
	...authApi,
	...sportApi,
	...teamApi,
	...stadiumApi,
	...eventApi,
	...reservationApi,
	...generalEventApi,
	...generalReservationApi,
])
