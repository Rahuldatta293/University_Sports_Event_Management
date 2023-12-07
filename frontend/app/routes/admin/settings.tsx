import {Button, PasswordInput, Select, TextInput} from "@mantine/core"
import type {ActionArgs, MetaFunction} from "@remix-run/node"
import {json} from "@remix-run/node"
import {useFetcher} from "@remix-run/react"
import * as React from "react"
import {badRequest} from "remix-utils"
import {toast} from "sonner"
import {z} from "zod"
import {PageHeading} from "~/components/ui/PageHeading"
import USStates from "~/data/UsStates"
import {updateUser} from "~/lib/user.server"
import {UpdateUserSchema} from "~/lib/zodios/user-api"
import {requireUserId} from "~/session.server"
import {useUser} from "~/utils/hooks"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

export const meta: MetaFunction = () => ({
	title: "Manage Profile",
})

const _UpdateUserSchema = UpdateUserSchema.extend({
	role: z.preprocess(Number, z.number().int().min(1).max(4)),
}).omit({
	isActive: true,
})

type ActionData = {
	fieldErrors?: inferErrors<typeof _UpdateUserSchema>
	success: boolean
}

export async function action({request}: ActionArgs) {
	const userId = await requireUserId(request)
	const {fields, fieldErrors} = await validateAction(request, _UpdateUserSchema)

	console.log(fields, fieldErrors)

	if (fieldErrors) {
		return badRequest<ActionData>({
			fieldErrors,
			success: false,
		})
	}

	const updateUserResponse = await updateUser(userId, {
		...fields,
		isActive: true,
	})

	console.log(updateUserResponse)

	if (!updateUserResponse.success) {
		return badRequest<ActionData>({
			success: false,
		})
	}

	return json<ActionData>({
		success: true,
	})
}

export default function ManageProfile() {
	const user = useUser()

	const fetcher = useFetcher<ActionData>()

	const isSubmitting = fetcher.state !== "idle"

	React.useEffect(() => {
		if (isSubmitting) return
		if (!fetcher.data) return

		if (fetcher.data.success) {
			toast.success("Profile updated")
		} else {
			toast.error("Please try again")
		}
	}, [fetcher.data, isSubmitting])

	return (
		<>
			<div className="flex max-w-screen-xl flex-col space-y-12 p-10">
				<div className="flex flex-col space-y-6">
					<PageHeading title="Settings" />

					<fetcher.Form
						className="flex flex-col gap-6 rounded-lg border border-stone-300 bg-stone-100 p-6"
						method="post"
					>
						<input hidden name="role" defaultValue={user.role} />
						<div className="relative flex flex-col gap-3">
							<h2 className="font-cal text-xl">Name</h2>

							<TextInput
								className="max-w-md"
								name="name"
								defaultValue={user.name}
								error={fetcher.data?.fieldErrors?.name}
								maxLength={32}
								required={true}
							/>
						</div>

						<div className="relative flex flex-col gap-3">
							<h2 className="font-cal text-xl">Email</h2>

							<TextInput
								name="email"
								type="email"
								error={fetcher.data?.fieldErrors?.email}
								className="max-w-md"
								description="You cannot change your email address"
								defaultValue={user.email}
								readOnly
							/>
						</div>

						<div className="relative flex flex-col gap-3">
							<h2 className="font-cal text-xl">Password</h2>

							<PasswordInput
								className="max-w-md"
								name="password"
								error={fetcher.data?.fieldErrors?.password}
								placeholder="Leave blank to keep the same password"
								minLength={8}
							/>
						</div>

						<div className="relative flex flex-col gap-6">
							<h2 className="font-cal text-xl">Address</h2>

							<TextInput
								className="max-w-md"
								name="addressLine1"
								label="Address Line 1"
								defaultValue={user.addressLine1}
								error={fetcher.data?.fieldErrors?.name}
								maxLength={32}
								required={true}
							/>

							<TextInput
								className="max-w-md"
								name="addressLine2"
								label="Address Line 2"
								defaultValue={user.addressLine2}
								error={fetcher.data?.fieldErrors?.addressLine2}
								maxLength={32}
							/>

							<TextInput
								className="max-w-md"
								name="city"
								label="City"
								defaultValue={user.city}
								error={fetcher.data?.fieldErrors?.city}
								maxLength={32}
								required={true}
							/>

							<Select
								data={USStates.map((state) => ({
									label: state.name,
									value: state.name,
								}))}
								name="state"
								label="State"
								className="max-w-md"
								defaultValue={user.state}
								placeholder="Select a state"
								error={fetcher.data?.fieldErrors?.state}
								required
							/>

							<TextInput
								className="max-w-md"
								name="zipCode"
								label="Zip Code"
								defaultValue={user.zipCode}
								error={fetcher.data?.fieldErrors?.zipCode}
								maxLength={32}
								required={true}
							/>
						</div>

						<div className="flex items-center justify-end border-t border-t-stone-300">
							<Button
								type="submit"
								loading={isSubmitting}
								color="dark"
								className="mt-4"
							>
								Update
							</Button>
						</div>
					</fetcher.Form>
				</div>
			</div>
		</>
	)
}
