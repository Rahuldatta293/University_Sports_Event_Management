import {PlusIcon} from "@heroicons/react/24/solid"
import {ActionIcon, Button, TextInput, Textarea, clsx} from "@mantine/core"
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
import {createSport, getAllSports, updateSport} from "~/lib/sport.server"
import {useSort} from "~/utils/hooks/use-sort"
import {badRequest} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

enum MODE {
	edit,
	add,
}

const ManageSportSchema = z.object({
	sportId: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
})

interface ActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof ManageSportSchema>
}

export const loader = async () => {
	const sportsResponse = await getAllSports()

	if (!sportsResponse.success) {
		return json({sports: []})
	}

	const sports = sportsResponse.data!
	return json({sports})
}

export const action: ActionFunction = async ({request}) => {
	const {fields, fieldErrors} = await validateAction(request, ManageSportSchema)

	if (fieldErrors) {
		return badRequest<ActionData>({success: false, fieldErrors})
	}

	const {sportId, ...rest} = fields
	if (sportId) {
		await updateSport(sportId, rest)
		return json<ActionData>({
			success: true,
			message: "Sport updated successfully",
		})
	}

	await createSport({...rest})

	return json<ActionData>({
		success: true,
		message: "Sport added successfully",
	})
}

type SportType = SerializeFrom<typeof loader>["sports"][number]
type SortKey = keyof Pick<SportType, "name" | "description">

export default function ManageSports() {
	const fetcher = useFetcher<ActionData>()
	const {sports} = useLoaderData<typeof loader>()

	const [query, setQuery] = React.useState<string>("")

	const [selectedSport, setSelectedSport] = React.useState<SportType | null>(
		null
	)
	const [mode, setMode] = React.useState<MODE>(MODE.edit)
	const [isModalOpen, handleModal] = useDisclosure(false)

	const {sortParams, toggleSort} = useSort<SportType>("name")

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

	const isSubmitting = fetcher.state !== "idle"

	const filteredData = React.useMemo(() => {
		let filteredData = sports

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = sports.filter((sport) =>
				sport.name.toLowerCase().includes(lowerCaseQuery)
			)
		}

		filteredData.sort((a, b) => {
			if (sortParams.direction === "asc") {
				return a[sortParams.key] > b[sortParams.key] ? 1 : -1
			}
			return a[sortParams.key] < b[sortParams.key] ? 1 : -1
		})

		return filteredData
	}, [query, sortParams.direction, sortParams.key, sports])

	React.useEffect(() => {
		if (fetcher.state !== "idle") {
			return
		}

		if (fetcher.data?.success) {
			toast.success(fetcher.data.message)
			setSelectedSport(null)
			handleModal.close()
		}
		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data?.success, fetcher.state])
	return (
		<>
			<TailwindContainer className="rounded-md">
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<PageHeading
						title="Manage Sports"
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
								<span className="ml-2">Add Sport</span>
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
													label="Description"
													sortKey="description"
												/>
											</th>

											<th
												scope="col"
												className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
											></th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredData.map((sport) => (
											<tr key={sport.id}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
													{sport.name}
												</td>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
													{sport.description}
												</td>
												<td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 md:pr-0">
													<div className="flex items-center gap-6">
														<Button
															loading={isSubmitting}
															variant="subtle"
															loaderPosition="right"
															onClick={() => {
																const _sport = sports.find(
																	(s) => s.id === sport.id
																)
																if (!_sport) return

																setSelectedSport(_sport)
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
					"Edit Sport": mode === MODE.edit,
					"Add Sport": mode === MODE.add,
				})}
				overlayProps={{blur: 1.2, opacity: 0.6}}
			>
				<fetcher.Form method="post" replace>
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						<input type="hidden" name="sportId" value={selectedSport?.id} />

						<TextInput
							name="name"
							label="Name"
							defaultValue={selectedSport?.name}
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<Textarea
							name="description"
							label="Description"
							defaultValue={selectedSport?.description}
							error={fetcher.data?.fieldErrors?.description}
							rows={4}
							required
						/>

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => {
									setSelectedSport(null)
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
								{mode === MODE.edit ? "Save changes" : "Add sport"}
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}
