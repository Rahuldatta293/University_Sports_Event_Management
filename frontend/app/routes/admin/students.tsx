import {PlusIcon} from "@heroicons/react/24/solid"
import {
	ActionIcon,
	Badge,
	Button,
	Divider,
	NumberInput,
	PasswordInput,
	Select,
	Switch,
	TextInput,
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
import {createUser, getAllUsers} from "~/lib/user.server"
import type {EditUserActionData} from "~/routes/api/edit-user"
import {UserRole} from "~/utils/constants"
import {useSort} from "~/utils/hooks/use-sort"
import {badRequest} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

const AddStudentSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().trim().min(1, "Password is required"),
	addressLine1: z.string().min(1, "Address Line 1 is required"),
	addressLine2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "Zip Code is required"),
})

interface ActionData {
	success: boolean
	message?: string
	fieldErrors?: inferErrors<typeof AddStudentSchema>
}

export const loader = async () => {
	const usersResponse = await getAllUsers()

	if (!usersResponse.success) {
		return json({students: []})
	}

	const students = usersResponse.data!.filter(
		(user) => user.role === UserRole.USER
	)

	return json({students})
}

export const action: ActionFunction = async ({request}) => {
	const {fields, fieldErrors} = await validateAction(request, AddStudentSchema)

	if (fieldErrors) {
		return badRequest<ActionData>({success: false, fieldErrors})
	}

	await createUser({
		...fields,
		role: UserRole.USER,
	})

	return json<ActionData>({
		success: true,
		message: "Student created successfully",
	})
}

type StudentType = SerializeFrom<typeof loader>["students"][0]
type SortKey = keyof Pick<StudentType, "name" | "email" | "isActive">

export default function ManageStudents() {
	const fetcher = useFetcher<ActionData>()
	const {students} = useLoaderData<typeof loader>()

	const [query, setQuery] = React.useState<string>("")

	const [isModalOpen, handleModal] = useDisclosure(false)

	const isSubmitting = fetcher.state !== "idle"

	React.useEffect(() => {
		if (isSubmitting) {
			return
		}

		if (fetcher.data?.success) {
			toast.success(fetcher.data.message)
			handleModal.close()
		}
		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data, isSubmitting])

	const {sortParams, toggleSort} = useSort<StudentType>("name")

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
		let filteredData = students

		if (query) {
			const lowerCaseQuery = query.toLowerCase()
			filteredData = students.filter(
				(s) =>
					s.name.toLowerCase().includes(lowerCaseQuery) ||
					s.email.toLowerCase().includes(lowerCaseQuery)
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
	}, [query, sortParams.direction, sortParams.key, students])

	return (
		<>
			<TailwindContainer className="rounded-md">
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<PageHeading
						title="Manage Students"
						rightSection={
							<Button
								loading={isSubmitting}
								loaderPosition="left"
								onClick={() => handleModal.open()}
							>
								<PlusIcon className="h-4 w-4" />
								<span className="ml-2">Add Student</span>
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
												<SortableHeader label="Email" sortKey="email" />
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
										{filteredData.map((student) => (
											<StudentRow student={student} key={student.id} />
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
				onClose={() => handleModal.close()}
				title="Add Student"
				overlayProps={{blur: 1.2, opacity: 0.6}}
			>
				<fetcher.Form method="post" replace>
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						<TextInput
							name="name"
							label="Name"
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<TextInput
							name="email"
							label="Email"
							type="email"
							error={fetcher.data?.fieldErrors?.email}
							required
						/>

						<PasswordInput
							name="password"
							label="Password"
							error={fetcher.data?.fieldErrors?.password}
							required
						/>

						<TextInput
							name="addressLine1"
							label="Address Line 1"
							error={fetcher.data?.fieldErrors?.addressLine1}
							required
						/>

						<TextInput
							name="addressLine2"
							label="Address Line 2"
							error={fetcher.data?.fieldErrors?.addressLine2}
						/>

						<div className="grid grid-cols-2 gap-4">
							<TextInput
								name="city"
								label="City"
								error={fetcher.data?.fieldErrors?.city}
								required
							/>

							<Select
								data={USStates.map((state) => ({
									label: state.name,
									value: state.name,
								}))}
								label="State"
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
							error={fetcher.data?.fieldErrors?.zipCode}
							required
						/>

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => handleModal.close()}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								loaderPosition="right"
							>
								Add Student
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}

function StudentRow({
	student,
}: {
	student: SerializeFrom<typeof loader>["students"][0]
}) {
	const fetcher = useFetcher<EditUserActionData>()

	const isSubmitting = fetcher.state !== "idle"
	const [isModalOpen, handleModal] = useDisclosure(false)

	React.useEffect(() => {
		if (isSubmitting) {
			return
		}

		if (fetcher.data?.success) {
			toast.success(fetcher.data.message)
			handleModal.close()
		}

		// handleModal is not meemoized, so we don't need to add it to the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data?.success, fetcher.state, isSubmitting])

	return (
		<>
			<tr key={student.id}>
				<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
					{student.name}
				</td>
				<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
					{student.email}
				</td>
				<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
					<Badge
						color={student.isActive ? "blue" : "red"}
						variant="light"
						radius="xs"
					>
						{student.isActive ? "Active" : "Inactive"}
					</Badge>
				</td>
				<td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 md:pr-0">
					<Button
						loading={isSubmitting}
						variant="subtle"
						loaderPosition="right"
						onClick={() => {
							handleModal.open()
						}}
					>
						Edit
					</Button>
				</td>
			</tr>

			<CustomDrawer
				opened={isModalOpen}
				onClose={() => handleModal.close()}
				title="Edit Student"
				overlayProps={{blur: 1.2, opacity: 0.6}}
			>
				<fetcher.Form method="post" replace action="/api/edit-user">
					<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
						<input hidden name="userId" defaultValue={student.id} />
						<input hidden name="role" defaultValue={UserRole.USER} />

						<TextInput
							name="name"
							label="Name"
							defaultValue={student.name}
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<TextInput
							name="email"
							label="Email"
							type="email"
							defaultValue={student.email}
							error={fetcher.data?.fieldErrors?.email}
							readOnly
						/>

						<PasswordInput
							name="password"
							label="Password"
							placeholder="Leave blank to keep the same password"
							error={fetcher.data?.fieldErrors?.password}
						/>

						<TextInput
							name="addressLine1"
							label="Address Line 1"
							error={fetcher.data?.fieldErrors?.addressLine1}
							defaultValue={student.addressLine1}
							required
						/>

						<TextInput
							name="addressLine2"
							label="Address Line 2"
							defaultValue={student.addressLine2}
							error={fetcher.data?.fieldErrors?.addressLine2}
						/>

						<div className="grid grid-cols-2 gap-4">
							<TextInput
								name="city"
								label="City"
								defaultValue={student.city}
								error={fetcher.data?.fieldErrors?.city}
								required
							/>

							<Select
								data={USStates.map((state) => ({
									label: state.name,
									value: state.name,
								}))}
								label="State"
								placeholder="Select a state"
								withinPortal
								name="state"
								searchable
								clearable
								maxDropdownHeight={200}
								defaultValue={student.state}
								error={fetcher.data?.fieldErrors?.state}
								required
							/>
						</div>

						<NumberInput
							name="zipCode"
							label="Zip Code"
							error={fetcher.data?.fieldErrors?.zipCode}
							defaultValue={Number(student.zipCode)}
							required
						/>

						<Switch
							name="isActive"
							label="Active"
							labelPosition="left"
							defaultChecked={student.isActive}
						/>

						<Divider my={12} />

						<div className="mt-1 flex items-center justify-end gap-4">
							<Button
								variant="subtle"
								disabled={isSubmitting}
								onClick={() => handleModal.close()}
								color="red"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isSubmitting}
								loaderPosition="right"
							>
								Update
							</Button>
						</div>
					</fieldset>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}
