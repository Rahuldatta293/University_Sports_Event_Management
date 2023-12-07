import {Button, PasswordInput, SegmentedControl, TextInput} from "@mantine/core"
import type {ActionFunction} from "@remix-run/node"
import {Link, useFetcher, useSearchParams} from "@remix-run/react"
import {LockIcon} from "lucide-react"
import * as React from "react"
import {toast} from "sonner"
import {verifyLogin} from "~/lib/user.server"
import {LoginSchema} from "~/lib/zod.schema"
import {createUserSession} from "~/session.server"
import {UserRole} from "~/utils/constants"
import {userRoleLookup} from "~/utils/misc"
import {badRequest, safeRedirect} from "~/utils/misc.server"
import type {inferErrors} from "~/utils/validation"
import {validateAction} from "~/utils/validation"

interface ActionData {
	fieldErrors?: inferErrors<typeof LoginSchema>
}

export const action: ActionFunction = async ({request}) => {
	const {fieldErrors, fields} = await validateAction(request, LoginSchema)

	if (fieldErrors) {
		return badRequest<ActionData>({fieldErrors})
	}

	const {email, password, redirectTo, remember, role} = fields

	const loginResponse = await verifyLogin({email, password, role})
	if (!loginResponse.success) {
		return badRequest<ActionData>({
			fieldErrors: {
				password: loginResponse.message,
			},
		})
	}

	return createUserSession({
		request,
		userId: loginResponse.data!,
		role,
		remember: remember === "on" ? true : false,
		redirectTo: safeRedirect(redirectTo),
	})
}

export default function Login() {
	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"
	const [searchParams, setSearchParams] = useSearchParams()

	const [role, setRole] = React.useState<UserRole>(UserRole.USER)

	React.useEffect(() => {
		const message = searchParams.get("message")

		if (!message) return
		console.log("message", message)

		toast.success(message)

		setSearchParams({})
	}, [searchParams, setSearchParams])

	return (
		<>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome back!
					</h1>
					<p className="text-muted-foreground text-sm">
						Enter your credentials below to continue
					</p>
				</div>
				<fetcher.Form
					method="post"
					className="w-full rounded bg-white px-6 pb-8 pt-6 text-black"
				>
					<div className="flex flex-col gap-4">
						<SegmentedControl
							fullWidth
							name="role"
							value={role.toString()}
							onChange={(role) => setRole(parseInt(role))}
							data={Object.values(UserRole)
								.filter((value) => typeof value === "number")
								.map((role) => ({
									label: userRoleLookup(role as UserRole),
									value: role.toString(),
								}))}
						/>

						<TextInput
							type="email"
							name="email"
							label="Email"
							autoFocus={true}
							placeholder="Enter your email"
							error={fetcher.data?.fieldErrors?.email}
							withAsterisk={false}
							required
						/>

						<PasswordInput
							name="password"
							label="Password"
							withAsterisk={false}
							placeholder="Enter your password"
							error={fetcher.data?.fieldErrors?.password}
							required
						/>
					</div>
					<div className="my-4 flex items-center justify-between">
						<Link
							to="/forgot-password"
							prefetch="intent"
							className="font-roboto text-sm font-medium text-blue-500 hover:underline"
						>
							Forgot password
						</Link>

						{role === UserRole.USER && (
							<Link
								to="/register"
								prefetch="intent"
								className="font-roboto text-sm font-medium text-blue-500 hover:underline"
							>
								Register
							</Link>
						)}
					</div>
					<Button
						fullWidth
						type="submit"
						loading={isSubmitting}
						leftIcon={<LockIcon size={16} />}
					>
						Login
					</Button>
				</fetcher.Form>
			</div>
		</>
	)
}
