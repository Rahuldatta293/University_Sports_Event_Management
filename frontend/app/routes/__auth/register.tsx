import {
	Anchor,
	Button,
	NumberInput,
	PasswordInput,
	Select,
	TextInput,
} from "@mantine/core"
import type {ActionFunction} from "@remix-run/node"
import {Link, useFetcher} from "@remix-run/react"
import USStates from "~/data/UsStates"
import {createUser} from "~/lib/user.server"
import {RegisterUserSchema} from "~/lib/zod.schema"
import {createUserSession} from "~/session.server"
import {UserRole} from "~/utils/constants"
import {badRequest} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

interface ActionData {
	fieldErrors?: inferErrors<typeof RegisterUserSchema>
}

export const action: ActionFunction = async ({request}) => {
	const {fieldErrors, fields} = await validateAction(
		request,
		RegisterUserSchema
	)
	if (fieldErrors) {
		return badRequest<ActionData>({fieldErrors})
	}

	const userResponse = await createUser({
		...fields,
		role: UserRole.USER,
	})

	if (!userResponse.success) {
		return badRequest<ActionData>({
			fieldErrors: {
				email: userResponse.message,
			},
		})
	}

	return createUserSession({
		request,
		userId: userResponse.data!,
		role: UserRole.USER,
		redirectTo: "/",
	})
}

export default function Register() {
	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"

	return (
		<>
			<div>
				<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Register</h2>
				<p className="mt-2 text-sm text-gray-600">
					Have an account already?{" "}
					<Anchor component={Link} to="/login" size="sm" prefetch="intent">
						Sign in
					</Anchor>
				</p>
			</div>

			<fetcher.Form replace method="post" className="mt-8">
				<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
					<TextInput
						name="name"
						autoComplete="given-name"
						label="Name"
						error={fetcher.data?.fieldErrors?.name}
						required
					/>

					<TextInput
						name="email"
						type="email"
						autoComplete="email"
						label="Email address"
						error={fetcher.data?.fieldErrors?.email}
						required
					/>

					<PasswordInput
						name="password"
						label="Password"
						error={fetcher.data?.fieldErrors?.password}
						autoComplete="current-password"
						required
					/>

					<PasswordInput
						name="confirmPassword"
						label="Confirm password"
						error={fetcher.data?.fieldErrors?.password}
						autoComplete="current-password"
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

					<Button
						type="submit"
						loading={isSubmitting}
						fullWidth
						loaderPosition="right"
						mt="1rem"
					>
						Register
					</Button>
				</fieldset>
			</fetcher.Form>
		</>
	)
}
