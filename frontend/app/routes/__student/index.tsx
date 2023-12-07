import type {SerializeFrom} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useLoaderData} from "@remix-run/react"
import {
	AlignHorizontalDistributeEndIcon,
	BuildingIcon,
	CalendarDaysIcon,
	CalendarRangeIcon,
	ClockIcon,
} from "lucide-react"
import * as React from "react"
import invariant from "tiny-invariant"
import {EmptyState} from "~/components/ui/EmptyState"
import {PageHeading} from "~/components/ui/PageHeading"
import {getAllEvents} from "~/lib/event.server"
import {formatDate, formatTime} from "~/utils/misc"

export const loader = async () => {
	const eventsResponse = await getAllEvents()

	if (eventsResponse.success) {
		const events = eventsResponse.data

		invariant(events, "Events should be defined")
		return json({events})
	}

	return json({events: []})
}

export default function Events() {
	const {events} = useLoaderData<typeof loader>()

	const upcomingSportEvents = React.useMemo(
		() => events.filter((event) => new Date(event.startDateTime) > new Date()),
		[events]
	)

	return (
		<>
			<>
				<div className="flex max-w-screen-xl flex-col gap-12 p-10">
					<div className="flex flex-col gap-8">
						<PageHeading title="Overview" />

						{upcomingSportEvents.length > 0 ? (
							<div className="grid grid-cols-3 gap-8">
								{upcomingSportEvents.map((event) => (
									<Card key={event.id} event={event} />
								))}
							</div>
						) : (
							<EmptyState
								label="No upcoming sport events, check back later"
								icon={<CalendarRangeIcon size={70} className="text-gray-600" />}
							/>
						)}
					</div>
				</div>
			</>
		</>
	)
}

export function Card({
	event,
}: {
	event: SerializeFrom<typeof loader>["events"][0]
}) {
	return (
		<>
			<div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex-auto pl-6 pt-6">
						<dt className="text-base font-semibold leading-6 text-gray-900">
							{event.name}
						</dt>
					</div>

					<div className="mt-8 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Team</span>
							<AlignHorizontalDistributeEndIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							{event.teamOne.name} vs {event.teamTwo.name}
						</dd>
					</div>

					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Date</span>
							<CalendarDaysIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="flex items-center gap-4 text-sm leading-6 text-gray-500">
							<span>{formatDate(event.startDateTime)}</span>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Time</span>
							<ClockIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<span>
								{formatTime(event.startDateTime)} -{" "}
								{formatTime(event.endDateTime)}
							</span>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Status</span>
							<BuildingIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							{event.stadium.name}
						</dd>
					</div>
				</dl>
				<div className="mt-6 border-t border-gray-900/5 px-6 py-6">
					<Link
						className="text-sm font-semibold leading-6 text-gray-900"
						to="/my-events?tab=sport-events"
					>
						Get Tickets <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</div>
		</>
	)
}
