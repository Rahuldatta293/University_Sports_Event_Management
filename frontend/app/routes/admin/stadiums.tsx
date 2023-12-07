import {PlusIcon} from "@heroicons/react/24/solid"
import {
	ActionIcon,
	Button,
	NumberInput,
	Select,
	TextInput,
	clsx,
} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import type {ActionFunction, SerializeFrom} from "@remix-run/node"
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
	createStadium,
	getAllStadiums,
	updateStadium,
} from "~/lib/stadium.server"
import {useSort} from "~/utils/hooks/use-sort"
import {badRequest} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

enum MODE {
	edit,
	add,
}

const ManageStadiumSchema = z.object({
	stadiumId: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	capacity: z.string().transform(Number),
	addressLine1: z.string().min(1, {message: "Address line 1 is required"}),
	addressLine2: z.string().optional(),
	city: z.string().min(1, {message: "City is required"}),
	state: z.string().min(1, {message: "State is required"}),
	zipCode: z.string().min(1, {message: "Zip is required"}),
})

interface ActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof ManageStadiumSchema>
}

export const loader = async () => {
	const stadiumResponse = await getAllStadiums()

	if (!stadiumResponse.success) {
		return json({stadiums: []})
	}

	const stadiums = stadiumResponse.data!
	return json({stadiums})
}

export const action: ActionFunction = async ({request}) => {
	const {fields, fieldErrors} = await validateAction(
		request,
		ManageStadiumSchema
	)

	if (fieldErrors) {
		return badRequest<ActionData>({success: false, fieldErrors})
	}

	const {stadiumId, ...rest} = fields
	if (stadiumId) {
		await updateStadium(stadiumId, rest)
		return json<ActionData>({
			success: true,
			message: "Stadium updated successfully",
		})
	}

	await createStadium({...rest})

	return json<ActionData>({
		success: true,
		message: "Stadium added successfully",
	})
}

type StadiumType = SerializeFrom<typeof loader>["stadiums"][number]
type SortableStadiumKey = keyof Pick<
	StadiumType,
	"name" | "addressLine1" | "capacity"
>

export default function ManageStadium() {
	const fetcher = useFetcher<ActionData>()
	const {stadiums} = useLoaderData<typeof loader>()

	const [query, setQuery] = React.useState<string>("")

	const {sortParams, toggleSort} = useSort<StadiumType>("name")

	const SortableHeader = ({
		label,
		sortKey,
	}: {
		label: string
		sortKey: SortableStadiumKey
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

	const [selectedStadium, setSelectedStadium] =
		React.useState<StadiumType | null>(null)
	const [mode, setMode] = React.useState<MODE>(MODE.edit)
	const [isModalOpen, handleModal] = useDisclosure(false)

	const isSubmitting = fetcher.state !== "idle"

	React.useEffect(() => {
		if (fetcher.state !== "idle") {
			return
		}

		if (fetcher.data?.success) {
			toast.success(fetcher.data.message)
			setSelectedStadium(null)
			handleModal.close()
		}
		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data?.success, fetcher.state])

	const filteredData = React.useMemo(() => {
		let filteredData = stadiums

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = stadiums.filter(
				(s) =>
					s.name.toLowerCase().includes(lowerCaseQuery) ||
					s.addressLine1.toLowerCase().includes(lowerCaseQuery) ||
					s.city.toLowerCase().includes(lowerCaseQuery) ||
					s.state.toLowerCase().includes(lowerCaseQuery) ||
					s.zipCode.toLowerCase().includes(lowerCaseQuery)
			)
		}

		filteredData.sort((a, b) => {
			if (sortParams.direction === "asc") {
				// @ts-expect-error
				return a[sortParams.key] > b[sortParams.key] ? 1 : -1
			}
			// @ts-expect-error
			return a[sortParams.key] < b[sortParams.key] ? 1 : -1
		})

		return filteredData
	}, [query, sortParams.direction, sortParams.key, stadiums])

	return (
		<>
			<TailwindContainer className="rounded-md">
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<PageHeading
						title="Manage Stadiums"
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
								<span className="ml-2">Add Stadium</span>
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
												className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
											></th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredData.map((stadium) => (
											<tr key={stadium.id}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
													{stadium.name}
												</td>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
													{stadium.addressLine1}, {stadium?.addressLine2},{" "}
													{stadium.city}, {stadium.state} - {stadium.zipCode}
												</td>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
													{stadium.capacity}
												</td>
												<td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 md:pr-0">
													<div className="flex items-center gap-6">
														<Button
															loading={isSubmitting}
															variant="subtle"
															compact
															loaderPosition="right"
															onClick={() => {
																const _stadium = stadiums.find(
																	(s) => s.id === stadium.id
																)
																if (!_stadium) return
																setSelectedStadium(_stadium)
																handleModal.open()
																setMode(MODE.edit)
															}}
														>
															Edit
														</Button>
													</div>
												</td>
											</tr>
										))}
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
					handleModal.close()
				}}
				title={clsx({
					"Edit Stadium": mode === MODE.edit,
					"Add Stadium": mode === MODE.add,
				})}
				overlayProps={{blur: 1.2, opacity: 0.6}}
			>
				<fetcher.Form method="post" replace>
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						<input type="hidden" name="stadiumId" value={selectedStadium?.id} />

						<TextInput
							name="name"
							label="Name"
							defaultValue={selectedStadium?.name}
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<NumberInput
							name="capacity"
							label="Max Capacity"
							defaultValue={selectedStadium?.capacity}
							error={fetcher.data?.fieldErrors?.capacity}
							required
						/>

						<TextInput
							name="addressLine1"
							label="Address Line 1"
							defaultValue={selectedStadium?.addressLine1}
							error={fetcher.data?.fieldErrors?.addressLine1}
							required
						/>

						<TextInput
							name="addressLine2"
							label="Address Line 2"
							defaultValue={selectedStadium?.addressLine2}
							error={fetcher.data?.fieldErrors?.addressLine2}
						/>

						<div className="grid grid-cols-2 gap-4">
							<TextInput
								name="city"
								label="City"
								defaultValue={selectedStadium?.city}
								error={fetcher.data?.fieldErrors?.city}
								required
							/>

							<Select
								data={USStates.map((state) => ({
									label: state.name,
									value: state.name,
								}))}
								label="State"
								defaultValue={selectedStadium?.state}
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
								selectedStadium?.zipCode
									? Number(selectedStadium?.zipCode)
									: undefined
							}
							error={fetcher.data?.fieldErrors?.zipCode}
							required
						/>

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => {
									setSelectedStadium(null)
									handleModal.close()
								}}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								loaderPosition="right"
							>
								{mode === MODE.edit ? "Save changes" : "Add stadium"}
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}
