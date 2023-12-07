import {PlusIcon} from "@heroicons/react/24/solid"
import {
	ActionIcon,
	Badge,
	Button,
	NumberInput,
	Select,
	TextInput,
	Textarea,
	clsx,
} from "@mantine/core"
import type {DateValue} from "@mantine/dates"
import {DateTimePicker} from "@mantine/dates"
import {useDisclosure} from "@mantine/hooks"
import type {ActionFunction, LoaderArgs, SerializeFrom} from "@remix-run/node"
import {json} from "@remix-run/node"
import {useFetcher, useLoaderData} from "@remix-run/react"
import {ArrowDownIcon, ArrowUpIcon, XIcon} from "lucide-react"
import * as React from "react"
import {toast} from "sonner"
import {z} from "zod"
import {TailwindContainer} from "~/components/TailwindContainer"
import {CustomDrawer} from "~/components/ui/CustomDrawer"
import {PageHeading} from "~/components/ui/PageHeading"
import USStates from "~/data/UsStates"
import {
	createGeneralEvent,
	getGeneralEventsByOrganizerId,
	updateGeneralEvent,
} from "~/lib/general-event.server"

import type {CancelEventActionData} from "~/routes/api/cancel-event"
import {requireUserId} from "~/session.server"
import {useSort} from "~/utils/hooks/use-sort"
import {formatDateTime} from "~/utils/misc"
import {badRequest} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

enum MODE {
	edit,
	add,
}

const ManageGeneralEventSchema = z.object({
	eventId: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	startDateTime: z.string().min(1, "Start date is required"),
	endDateTime: z.string().min(1, "End date is required"),
	capacity: z
		.string()
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().min(1, "Capacity must be greater than 0")),
	addressLine1: z.string().min(1, {message: "Address line 1 is required"}),
	addressLine2: z.string().optional(),
	city: z.string().min(1, {message: "City is required"}),
	state: z.string().min(1, {message: "State is required"}),
	zipCode: z.string().min(1, {message: "Zip is required"}),
})

interface ActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof ManageGeneralEventSchema>
}

export const loader = async ({request}: LoaderArgs) => {
	const organizerId = await requireUserId(request)

	const eventsResponse = await getGeneralEventsByOrganizerId(organizerId)

	const events = eventsResponse.success ? eventsResponse.data ?? [] : []

	return json({
		events,
	})
}

export const action: ActionFunction = async ({request}) => {
	const organizerId = await requireUserId(request)
	const {fields, fieldErrors} = await validateAction(
		request,
		ManageGeneralEventSchema
	)

	if (fieldErrors) {
		return badRequest<ActionData>({
			success: false,
			message: "There were errors with your submission",
			fieldErrors,
		})
	}

	const {eventId, ...rest} = fields
	if (eventId) {
		await updateGeneralEvent(eventId, rest)
		return json({
			success: true,
			message: "Event updated successfully",
		})
	}

	await createGeneralEvent({
		...rest,
		organizerId,
	})

	return json({
		success: true,
		message: "Event created successfully",
	})
}

type GeneralEventType = SerializeFrom<typeof loader>["events"][number]
type SortKey = keyof Pick<
	GeneralEventType,
	"name" | "capacity" | "isActive" | "addressLine1"
>

export default function ManageGeenralEvents() {
	const fetcher = useFetcher<ActionData>()
	const cancelEventfetcher = useFetcher<CancelEventActionData>()
	const isCancelling = cancelEventfetcher.state !== "idle"

	const {events} = useLoaderData<typeof loader>()

	const [selectedEvent, setSelectedEvent] =
		React.useState<GeneralEventType | null>(null)
	const [selectedStartDateTime, setSelectedStartDateTime] = React.useState<
		DateValue | undefined
	>(undefined)
	const [selectedEndDateTime, setSelectedEndDateTime] = React.useState<
		DateValue | undefined
	>(undefined)

	const [mode, setMode] = React.useState<MODE>(MODE.edit)
	const [isModalOpen, handleModal] = useDisclosure(false)

	const [query, setQuery] = React.useState("")

	const {sortParams, toggleSort} = useSort<GeneralEventType>("name")

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

	const filteredData = React.useMemo(() => {
		let filteredData = events

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = events.filter((e) =>
				e.name.toLowerCase().includes(lowerCaseQuery)
			)
		}

		filteredData.sort((a, b) => {
			if (sortParams.direction === "asc") {
				// @ts-expect-error - Fix it later
				return a[sortParams.key] > b[sortParams.key] ? 1 : -1
			}
			// @ts-expect-error - Fix it later
			return a[sortParams.key] < b[sortParams.key] ? 1 : -1
		})

		return filteredData
	}, [events, query, sortParams.direction, sortParams.key])

	const isSubmitting = fetcher.state !== "idle"

	React.useEffect(() => {
		if (isSubmitting) return
		if (!fetcher.data) return

		if (!fetcher.data.success) {
			return
		}

		handleModal.close()
		toast.success(fetcher.data.message)
		setSelectedEvent(null)
		setSelectedStartDateTime(undefined)
		setSelectedEndDateTime(undefined)

		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data, isSubmitting])

	React.useEffect(() => {
		if (!selectedStartDateTime) return

		if (!selectedEndDateTime) {
			setSelectedEndDateTime(
				new Date(selectedStartDateTime.getTime() + 60 * 60 * 1000)
			)
			return
		}

		if (selectedStartDateTime.getTime() > selectedEndDateTime.getTime()) {
			setSelectedEndDateTime(
				new Date(selectedStartDateTime.getTime() + 60 * 60 * 1000)
			)
		}
	}, [selectedEndDateTime, selectedStartDateTime])

	return (
		<>
			<TailwindContainer className="rounded-md bg-white">
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<PageHeading
						title="General Events"
						rightSection={
							<Button
								loading={isSubmitting}
								loaderPosition="left"
								onClick={() => {
									setMode(MODE.add)
									handleModal.open()
								}}
							>
								<PlusIcon className="h-4 w-4" />
								<span className="ml-2">Add Event</span>
							</Button>
						}
					/>

					<div className="mt-8 flex max-w-sm items-center gap-4">
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

					<div className="mt-8 flex flex-col">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
											>
												<SortableHeader label="Name" sortKey="name" />
											</th>

											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
											>
												Schedule
											</th>

											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
											>
												<SortableHeader
													label="Address"
													sortKey="addressLine1"
												/>
											</th>

											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
											>
												<SortableHeader label="Capacity" sortKey="capacity" />
											</th>

											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
											>
												<SortableHeader label="Status" sortKey="isActive" />
											</th>
											<th
												scope="col"
												className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
											></th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredData.map((event) => {
											const isEventPast =
												new Date(event.startDateTime) < new Date()
											const fullAddress = `${event.addressLine1}${
												event.addressLine2 ? ", " + event.addressLine2 : ""
											}, ${event.city}, ${event.state}, ${event.zipCode}`
											return (
												<tr key={event.id}>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
														{event.name}
													</td>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
														<p>{formatDateTime(event.startDateTime)} -</p>
														<p>{formatDateTime(event.endDateTime)}</p>
													</td>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
														{fullAddress}
													</td>

													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
														{event.capacity}
													</td>

													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
														<Badge
															color={event.isActive ? "green" : "red"}
															radius="xs"
														>
															{event.isActive ? "Active" : "Cancelled"}
														</Badge>
													</td>

													<td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 md:pr-0">
														<div className="flex items-center gap-4">
															{event.isActive && !isEventPast ? (
																<Button
																	loading={isSubmitting}
																	variant="subtle"
																	compact
																	loaderPosition="right"
																	disabled={isCancelling}
																	onClick={() => {
																		const eventToEdit = events.find(
																			(e) => e.id === event.id
																		)

																		setMode(MODE.edit)

																		if (!eventToEdit) return

																		setSelectedEvent(eventToEdit)

																		setSelectedStartDateTime(
																			eventToEdit.startDateTime
																				? new Date(eventToEdit.startDateTime)
																				: undefined
																		)

																		setSelectedEndDateTime(
																			eventToEdit.endDateTime
																				? new Date(eventToEdit.endDateTime)
																				: undefined
																		)

																		handleModal.open()
																	}}
																>
																	Edit
																</Button>
															) : null}

															{event.isActive && !isEventPast ? (
																<Button
																	type="button"
																	loading={isCancelling}
																	variant="subtle"
																	compact
																	color="red"
																	loaderPosition="right"
																	disabled={isSubmitting}
																	onClick={() => {
																		cancelEventfetcher.submit(
																			{
																				eventId: event.id,
																			},
																			{
																				action: "/api/cancel-general-event",
																				method: "post",
																				replace: true,
																			}
																		)
																	}}
																>
																	Cancel
																</Button>
															) : null}
														</div>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</TailwindContainer>

			<CustomDrawer
				opened={isModalOpen}
				onClose={() => {
					setSelectedEvent(null)
					handleModal.close()
				}}
				title={clsx({
					"Edit Event": mode === MODE.edit,
					"Add Event": mode === MODE.add,
				})}
				overlayProps={{blur: 1.2, opacity: 0.6}}
			>
				<fetcher.Form method="post" replace>
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						<input type="hidden" name="eventId" value={selectedEvent?.id} />

						<TextInput
							name="name"
							label="Name"
							placeholder="Enter event name"
							defaultValue={selectedEvent?.name}
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<Textarea
							name="description"
							label="Description"
							placeholder="Enter event description"
							defaultValue={selectedEvent?.description}
							error={fetcher.data?.fieldErrors?.description}
							required
						/>

						<DateTimePicker
							valueFormat="MMM DD 'YY - hh:mm A"
							name="startDateTime"
							label="Event Start"
							minDate={
								mode === MODE.edit
									? new Date()
									: new Date(Date.now() + 86400000)
							}
							placeholder="Select a date & time"
							value={selectedStartDateTime}
							onChange={(val) => setSelectedStartDateTime(val)}
							error={fetcher.data?.fieldErrors?.startDateTime}
							withAsterisk
						/>

						<DateTimePicker
							valueFormat="MMM DD 'YY - hh:mm A"
							name="endDateTime"
							label="End Date & Time"
							placeholder="Select a date & time"
							minDate={
								mode === MODE.edit
									? new Date()
									: selectedStartDateTime ?? new Date(Date.now() + 86400000)
							}
							value={selectedEndDateTime}
							onChange={(val) => setSelectedEndDateTime(val)}
							disabled={selectedStartDateTime === null}
							error={fetcher.data?.fieldErrors?.endDateTime}
							withAsterisk
						/>

						<NumberInput
							name="capacity"
							label="Capacity"
							placeholder="Enter event capacity"
							defaultValue={selectedEvent?.capacity}
							error={fetcher.data?.fieldErrors?.capacity}
							withAsterisk
						/>

						<TextInput
							name="addressLine1"
							label="Address Line 1"
							defaultValue={selectedEvent?.addressLine1}
							error={fetcher.data?.fieldErrors?.addressLine1}
							required
						/>

						<TextInput
							name="addressLine2"
							label="Address Line 2"
							defaultValue={selectedEvent?.addressLine2}
							error={fetcher.data?.fieldErrors?.addressLine2}
						/>

						<div className="grid grid-cols-2 gap-4">
							<TextInput
								name="city"
								label="City"
								defaultValue={selectedEvent?.city}
								error={fetcher.data?.fieldErrors?.city}
								required
							/>

							<Select
								data={USStates.map((state) => ({
									label: state.name,
									value: state.name,
								}))}
								label="State"
								defaultValue={selectedEvent?.state}
								placeholder="Select a state"
								withinPortal
								name="state"
								searchable
								clearable
								maxDropdownHeight={200}
								error={fetcher.data?.fieldErrors?.state}
								required
							/>
						</div>

						<NumberInput
							name="zipCode"
							label="Zip Code"
							defaultValue={
								selectedEvent?.zipCode
									? Number(selectedEvent?.zipCode)
									: undefined
							}
							error={fetcher.data?.fieldErrors?.zipCode}
							required
						/>

						<div className="mb-4 mt-2 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => {
									setSelectedEvent(null)
									setSelectedStartDateTime(undefined)
									setSelectedEndDateTime(undefined)
									handleModal.close()
								}}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								disabled={!selectedStartDateTime || !selectedEndDateTime}
								loaderPosition="right"
							>
								{mode === MODE.edit ? "Save changes" : "Add event"}
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}
