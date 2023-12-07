import {InformationCircleIcon} from "@heroicons/react/24/solid"
import {
	ActionIcon,
	Alert,
	Badge,
	Button,
	Group,
	Select,
	Tabs,
	Text,
	TextInput,
} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import type {DataFunctionArgs, SerializeFrom} from "@remix-run/node"
import {json} from "@remix-run/node"
import {useFetcher, useLoaderData, useSearchParams} from "@remix-run/react"
import {ArrowDownIcon, ArrowUpIcon, ListXIcon, Plus, XIcon} from "lucide-react"
import * as React from "react"
import {toast} from "sonner"
import invariant from "tiny-invariant"
import {z} from "zod"
import {CustomDrawer} from "~/components/ui/CustomDrawer"
import {EmptyState} from "~/components/ui/EmptyState"
import {PageHeading} from "~/components/ui/PageHeading"
import {
	Table,
	TableBody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "~/components/ui/table"
import {getAllEvents} from "~/lib/event.server"
import {getAllGeneralEvents} from "~/lib/general-event.server"
import {
	createGeneralReservation,
	getGeneralReservationsByStudentId,
} from "~/lib/general-reservation.server"
import {
	createReservation,
	getReservationsByStudentId,
} from "~/lib/reservation.server"
import type {CancelReservationActionData} from "~/routes/api/cancel-reservation"
import {requireUserId} from "~/session.server"
import {useSort} from "~/utils/hooks/use-sort"
import {formatDateTime} from "~/utils/misc"
import {badRequest} from "~/utils/misc.server"
import {validateAction, type inferErrors} from "~/utils/validation"

const CreateReservationSchema = z.object({
	eventId: z.string().min(1, "Please select an event"),
	eventType: z.enum(["sport-events", "general-events"]),
})

interface ActionData {
	success: boolean
	message: string
	fieldErrors?: inferErrors<typeof CreateReservationSchema>
}

export const loader = async ({request}: DataFunctionArgs) => {
	const studentId = await requireUserId(request)

	const sportEventsResponse = await getAllEvents()
	const generalEventsResponse = await getAllGeneralEvents()

	const sportReservationsResponse = await getReservationsByStudentId(studentId)
	const generalReservationsResponse = await getGeneralReservationsByStudentId(
		studentId
	)

	if (
		!sportEventsResponse.success ||
		!generalEventsResponse.success ||
		!sportReservationsResponse.success ||
		!generalReservationsResponse.success
	) {
		return json({
			sportEvents: [],
			sportReservations: [],
			generalEvents: [],
			generalReservations: [],
		})
	}

	const sportEvents = sportEventsResponse.data
	const sportReservations = sportReservationsResponse.data
	const generalEvents = generalEventsResponse.data
	const generalReservations = generalReservationsResponse.data

	invariant(
		sportEvents && sportReservations && generalEvents && generalReservations,
		"Events and reservations must be defined"
	)

	return json({
		sportEvents: sportEvents.filter(
			(event) => new Date(event.startDateTime) > new Date() && event.isActive
		),
		sportReservations,
		generalEvents: generalEvents.filter(
			(event) => new Date(event.startDateTime) > new Date() && event.isActive
		),
		generalReservations,
	})
}

export const action = async ({request}: DataFunctionArgs) => {
	const studentId = await requireUserId(request)
	const {fields, fieldErrors} = await validateAction(
		request,
		CreateReservationSchema
	)

	if (fieldErrors) {
		return badRequest<ActionData>({
			success: false,
			message: "Invalid fields",
			fieldErrors,
		})
	}

	if (fields.eventType === "sport-events") {
		const response = await createReservation({
			studentId,
			eventId: fields.eventId,
		})

		if (!response.success) {
			return badRequest<ActionData>({
				success: false,
				message: response.message,
				fieldErrors: {
					eventId: response.message,
				},
			})
		}

		return json<ActionData>({
			success: true,
			message: response.message,
		})
	}

	if (fields.eventType === "general-events") {
		const response = await createGeneralReservation({
			studentId,
			eventId: fields.eventId,
		})

		if (!response.success) {
			return badRequest<ActionData>({
				success: false,
				message: response.message,
				fieldErrors: {
					eventId: response.message,
				},
			})
		}

		return json<ActionData>({
			success: true,
			message: response.message,
		})
	}

	return badRequest<ActionData>({
		success: false,
		message: "Invalid event type",
		fieldErrors: {
			eventId: "Invalid event type",
		},
	})
}

const TabsValue = {
	SPORT_EVENTS: "sport-events",
	GENERAL_EVENTS: "general-events",
}

type EventType = SerializeFrom<typeof loader>["generalReservations"][number]
type SortKey = keyof Pick<EventType, "event" | "seatNumber">

export default function Events() {
	const [searchParams, setSearchParams] = useSearchParams()
	const {sportReservations, sportEvents, generalEvents, generalReservations} =
		useLoaderData<typeof loader>()

	const fetcher = useFetcher<ActionData>()
	const [query, setQuery] = React.useState("")

	const [activeTab, setActiveTab] = React.useState<string | null>(
		searchParams.get("tab") ?? TabsValue.SPORT_EVENTS
	)

	const [isSportModalOpen, handleSportModal] = useDisclosure(false)
	const [isGeneralModalOpen, handleGeneralModal] = useDisclosure(false)
	const isSubmitting = fetcher.state !== "idle"

	const {sortParams, toggleSort} = useSort<EventType>("event")

	const SortableHeader = ({
		label,
		sortKey,
	}: {
		label: string
		sortKey: SortKey
	}) => {
		return (
			<Button
				variant="white"
				compact
				bg="transparent"
				onClick={() => toggleSort(sortKey)}
				rightIcon={
					sortParams.key === sortKey ? (
						sortParams.direction === "asc" ? (
							<ArrowUpIcon size={16} />
						) : (
							<ArrowDownIcon size={16} />
						)
					) : null
				}
			>
				<span>{label}</span>
			</Button>
		)
	}

	const filteredGeneralReservations = React.useMemo(() => {
		let filteredData = generalReservations

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = filteredData.filter((e) =>
				e.event.name.toLowerCase().includes(lowerCaseQuery)
			)
		}

		filteredData.sort((a, b) => {
			if (sortParams.direction === "asc") {
				return a[sortParams.key] > b[sortParams.key] ? 1 : -1
			}

			return a[sortParams.key] < b[sortParams.key] ? 1 : -1
		})

		return filteredData
	}, [generalReservations, query, sortParams.direction, sortParams.key])

	const filteredSportsReservations = React.useMemo(() => {
		let filteredData = sportReservations

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = filteredData.filter((e) =>
				e.event.name.toLowerCase().includes(lowerCaseQuery)
			)
		}

		filteredData.sort((a, b) => {
			if (sortParams.direction === "asc") {
				return a[sortParams.key] > b[sortParams.key] ? 1 : -1
			}

			return a[sortParams.key] < b[sortParams.key] ? 1 : -1
		})

		return filteredData
	}, [sportReservations, query, sortParams.direction, sortParams.key])

	React.useEffect(() => {
		let tab = searchParams.get("tab")

		if (!tab || !Object.values(TabsValue).includes(tab)) {
			const params = new URLSearchParams()
			params.set("tab", TabsValue.SPORT_EVENTS)
			setSearchParams(params)
			tab = TabsValue.SPORT_EVENTS
		}

		setActiveTab(tab)
	}, [searchParams, setSearchParams, setActiveTab])

	React.useEffect(() => {
		if (fetcher.state !== "idle") {
			return
		}

		if (!fetcher.data) return

		if (fetcher.data.success) {
			toast.success(fetcher.data.message)
			handleSportModal.close()
			handleGeneralModal.close()
		} else {
			toast.error(fetcher.data.message)
		}

		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data, fetcher.state])

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-8">
					<PageHeading
						title="My Events"
						rightSection={
							<Button
								color="dark"
								radius="md"
								disabled={!activeTab}
								onClick={() => {
									if (activeTab === TabsValue.GENERAL_EVENTS) {
										handleGeneralModal.open()
									} else if (activeTab === TabsValue.SPORT_EVENTS) {
										handleSportModal.open()
									}
								}}
								leftIcon={<Plus size={18} />}
							>
								Reserve Tickets
							</Button>
						}
					/>

					<div className="mt-8 flex max-w-md items-center gap-4">
						<TextInput
							value={query}
							placeholder="Enter your search query here"
							onChange={(e) => setQuery(e.target.value)}
						/>

						{query && (
							<ActionIcon onClick={() => setQuery("")} size="lg">
								<XIcon size={20} />
							</ActionIcon>
						)}
					</div>

					<Tabs
						variant="outline"
						value={activeTab}
						onTabChange={(tab) => {
							setActiveTab(tab)

							const params = new URLSearchParams()
							params.set("tab", tab ?? TabsValue.SPORT_EVENTS)
							setSearchParams(params)
						}}
					>
						<Tabs.List>
							<Tabs.Tab value={TabsValue.SPORT_EVENTS}>Sports</Tabs.Tab>
							<Tabs.Tab value={TabsValue.GENERAL_EVENTS}>General</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value={TabsValue.SPORT_EVENTS} pt="xs">
							{filteredSportsReservations.length > 0 ? (
								<div className="mt-8 flow-root">
									<div className="inline-block min-w-full py-2 align-middle">
										<Table>
											<TableThead>
												<TableTr>
													<TableTh pos="first">
														<SortableHeader label="Event" sortKey="event" />
													</TableTh>
													<TableTh>Schedule</TableTh>
													<TableTh>
														<SortableHeader
															label="Seat Number"
															sortKey="seatNumber"
														/>
													</TableTh>
													<TableTh>Status</TableTh>
													<TableTh pos="last">
														<span className="sr-only">Actions</span>
													</TableTh>
												</TableTr>
											</TableThead>
											<TableBody>
												{filteredSportsReservations.map((reservation, idx) => (
													<SportReservationRow
														idx={idx}
														key={reservation.id}
														reservation={reservation}
													/>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							) : (
								<EmptyState
									className="mt-4"
									label={
										query ? "No results found. Please try again." : "No events."
									}
									icon={<ListXIcon size={70} className="text-gray-600" />}
								/>
							)}
						</Tabs.Panel>

						<Tabs.Panel value={TabsValue.GENERAL_EVENTS} pt="xs">
							{filteredGeneralReservations.length > 0 ? (
								<div className="mt-8 flow-root">
									<div className="inline-block min-w-full py-2 align-middle">
										<Table>
											<TableThead>
												<TableTr>
													<TableTh pos="first">
														<SortableHeader label="Event" sortKey="event" />
													</TableTh>
													<TableTh>Schedule</TableTh>
													<TableTh>
														<SortableHeader
															label="Seat Number"
															sortKey="seatNumber"
														/>
													</TableTh>
													<TableTh>Status</TableTh>
													<TableTh pos="last">
														<span className="sr-only">Actions</span>
													</TableTh>
												</TableTr>
											</TableThead>
											<TableBody>
												{filteredGeneralReservations.map((reservation, idx) => (
													<GeneralReservationRow
														idx={idx}
														key={reservation.id}
														reservation={reservation}
													/>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							) : (
								<EmptyState
									className="mt-4"
									label={
										query ? "No results found. Please try again." : "No events."
									}
									icon={<ListXIcon size={70} className="text-gray-600" />}
								/>
							)}
						</Tabs.Panel>
					</Tabs>
				</div>
			</div>

			<CustomDrawer
				opened={isSportModalOpen}
				onClose={() => handleSportModal.close()}
				title="Buy tickets"
				overlayProps={{
					opacity: 0.6,
					blur: 1.2,
				}}
			>
				<fetcher.Form method="post" replace>
					<input hidden name="eventType" defaultValue={activeTab ?? ""} />
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						{fetcher.data?.fieldErrors?.eventId && (
							<Alert
								icon={<InformationCircleIcon className="h-6 w-6" />}
								title="Error"
								color="red"
							>
								{fetcher.data.fieldErrors.eventId}
							</Alert>
						)}

						<Select
							name="eventId"
							label="Event"
							withinPortal
							placeholder="Select an event"
							nothingFound="No events found"
							itemComponent={SelectSportItem}
							data={sportEvents.map((event) => {
								const availableSeats = event.capacity - event.reservedSeats

								return {
									start: event.startDateTime,
									end: event.endDateTime,
									address: event.stadium.name,
									label: `${event.name} (${availableSeats} seats available)`,
									value: event.id,
									disabled: availableSeats === 0,
								}
							})}
							error={Boolean(fetcher.data?.fieldErrors?.eventId)}
							required
						/>

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => handleSportModal.close()}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								loaderPosition="right"
							>
								Reserve your seat
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>

			<CustomDrawer
				opened={isGeneralModalOpen}
				onClose={() => handleGeneralModal.close()}
				title="Buy tickets"
				overlayProps={{
					opacity: 0.6,
					blur: 1.2,
				}}
			>
				<fetcher.Form method="post" replace>
					<input hidden name="eventType" defaultValue={activeTab ?? ""} />
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						{fetcher.data?.fieldErrors?.eventId && (
							<Alert
								icon={<InformationCircleIcon className="h-6 w-6" />}
								title="Error"
								color="red"
							>
								{fetcher.data.fieldErrors.eventId}
							</Alert>
						)}

						<Select
							name="eventId"
							label="Event"
							withinPortal
							placeholder="Select an event"
							nothingFound="No events found"
							itemComponent={SelectGeneralItem}
							data={generalEvents.map((event) => {
								const availableSeats = event.capacity - event.reservedSeats

								return {
									start: event.startDateTime,
									end: event.endDateTime,
									label: `${event.name} (${availableSeats} seats available)`,
									value: event.id,
									disabled: availableSeats === 0,
								}
							})}
							error={Boolean(fetcher.data?.fieldErrors?.eventId)}
							required
						/>

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => handleSportModal.close()}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								loaderPosition="right"
							>
								Reserve your seat
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}

function SportReservationRow({
	reservation,
	idx,
}: {
	reservation: SerializeFrom<typeof loader>["sportReservations"][number]
	idx: number
}) {
	const {sportReservations: reservations} = useLoaderData<typeof loader>()
	const isLastIndex = reservations.length - 1 === idx

	const cancelFetcher = useFetcher<CancelReservationActionData>()
	const isCancelling = cancelFetcher.state !== "idle"

	React.useEffect(() => {
		if (cancelFetcher.state !== "idle") {
			return
		}

		if (!cancelFetcher.data) return

		if (cancelFetcher.data.success) {
			toast.success(cancelFetcher.data.message)
		} else {
			toast.error(cancelFetcher.data.message)
		}
	}, [cancelFetcher.data, cancelFetcher.state])

	return (
		<TableTr key={reservation.id} hasBorder={!isLastIndex}>
			<TableTd pos="first">{reservation.event.name}</TableTd>

			<TableTd>
				<p>{formatDateTime(reservation.event.startDateTime)}</p>
				<p>{formatDateTime(reservation.event.endDateTime)}</p>
			</TableTd>

			<TableTd>{reservation.seatNumber}</TableTd>

			<TableTd>
				<Badge color={reservation.isCancelled ? "red" : "green"}>
					{reservation.isCancelled ? "Cancelled" : "Active"}
				</Badge>
			</TableTd>

			<TableTd pos="last">
				{!reservation.isCancelled ? (
					<Button
						type="button"
						loading={isCancelling}
						variant="subtle"
						color="red"
						compact
						loaderPosition="right"
						disabled={new Date(reservation.event.startDateTime) < new Date()}
						onClick={() => {
							cancelFetcher.submit(
								{
									reservationId: reservation.id,
								},
								{
									action: "/api/cancel-reservation",
									method: "post",
									replace: true,
								}
							)
						}}
					>
						Cancel
					</Button>
				) : null}
			</TableTd>
		</TableTr>
	)
}

function GeneralReservationRow({
	reservation,
	idx,
}: {
	reservation: SerializeFrom<typeof loader>["sportReservations"][number]
	idx: number
}) {
	const {sportReservations: reservations} = useLoaderData<typeof loader>()
	const isLastIndex = reservations.length - 1 === idx

	const cancelFetcher = useFetcher<CancelReservationActionData>()
	const isCancelling = cancelFetcher.state !== "idle"

	React.useEffect(() => {
		if (cancelFetcher.state !== "idle") {
			return
		}

		if (!cancelFetcher.data) return

		if (cancelFetcher.data.success) {
			toast.success(cancelFetcher.data.message)
		} else {
			toast.error(cancelFetcher.data.message)
		}
	}, [cancelFetcher.data, cancelFetcher.state])

	return (
		<TableTr key={reservation.id} hasBorder={!isLastIndex}>
			<TableTd pos="first">{reservation.event.name}</TableTd>

			<TableTd>
				<p>{formatDateTime(reservation.event.startDateTime)} - </p>
				<p>{formatDateTime(reservation.event.endDateTime)}</p>
			</TableTd>

			<TableTd>{reservation.seatNumber}</TableTd>

			<TableTd>
				<Badge color={reservation.isCancelled ? "red" : "green"}>
					{reservation.isCancelled ? "Cancelled" : "Active"}
				</Badge>
			</TableTd>

			<TableTd pos="last">
				{!reservation.isCancelled ? (
					<Button
						type="button"
						loading={isCancelling}
						variant="subtle"
						color="red"
						compact
						loaderPosition="right"
						disabled={new Date(reservation.event.startDateTime) < new Date()}
						onClick={() => {
							cancelFetcher.submit(
								{
									reservationId: reservation.id,
								},
								{
									action: "/api/cancel-general-reservation",
									method: "post",
									replace: true,
								}
							)
						}}
					>
						Cancel
					</Button>
				) : null}
			</TableTd>
		</TableTr>
	)
}

interface SportItemProps extends React.ComponentPropsWithoutRef<"div"> {
	start: string
	end: string
	address: string
	label: string
}

const SelectSportItem = React.forwardRef<HTMLDivElement, SportItemProps>(
	(props: SportItemProps, ref) => {
		const {start, end, address, label, ...others} = props
		return (
			<div ref={ref} {...others}>
				<Group noWrap>
					<div>
						<Text size="sm">{label}</Text>
						<Text size="xs" opacity={0.65}>
							{address}
						</Text>
						<Text size="xs" opacity={0.65}>
							{formatDateTime(start)} - {formatDateTime(end)}
						</Text>
					</div>
				</Group>
			</div>
		)
	}
)

interface GeneralItemProps extends React.ComponentPropsWithoutRef<"div"> {
	start: string
	end: string
	label: string
}

const SelectGeneralItem = React.forwardRef<HTMLDivElement, GeneralItemProps>(
	(props: GeneralItemProps, ref) => {
		const {start, end, label, ...others} = props
		return (
			<div ref={ref} {...others}>
				<Group noWrap>
					<div>
						<Text size="sm">{label}</Text>
						<Text size="xs" opacity={0.65}>
							{formatDateTime(start)} - {formatDateTime(end)}
						</Text>
					</div>
				</Group>
			</div>
		)
	}
)
