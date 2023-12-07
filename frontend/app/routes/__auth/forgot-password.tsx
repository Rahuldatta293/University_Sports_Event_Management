import {Button, NumberInput, PasswordInput, TextInput} from "@mantine/core"
import {json, type ActionFunction, redirect} from "@remix-run/node"
import {Link, useFetcher} from "@remix-run/react"
import * as React from "react"
import {toast} from "sonner"
import {resetPassword, sendResetPasswordEmail} from "~/lib/user.server"
import {badRequest} from "~/utils/misc.server"

interface ActionData {
	intent?: string
	message?: string
	success: boolean
	fieldErrors?: {
		email?: string
		password?: string
		token?: string
	}
}

export const action: ActionFunction = async ({request}) => {
	const formData = await request.formData()

	const intent = formData.get("intent")?.toString()
	const email = formData.get("email")?.toString()
	if (!email) {
		return badRequest<ActionData>({
			success: false,
			intent: "send-reset-password-email",
			message: "Email is required",
			fieldErrors: {
				email: "Email is required",
			},
		})
	}

	if (intent === "send-reset-password-email") {
		const sendEmailResponse = await sendResetPasswordEmail(email)

		if (!sendEmailResponse.success) {
			return badRequest<ActionData>({
				success: false,
				intent: "send-reset-password-email",
				message: sendEmailResponse.message,
				fieldErrors: {
					email: sendEmailResponse.message,
				},
			})
		}

		return json<ActionData>({
			success: true,
			intent: "send-reset-password-email",
			message: "OTP sent to your email",
		})
	} else if (intent === "reset-password") {
		const token = formData.get("token")?.toString()
		const password = formData.get("password")?.toString()

		if (!token) {
			return badRequest<ActionData>({
				success: false,
				intent: "reset-password",
				message: "Token is required",
				fieldErrors: {
					token: "Token is required",
				},
			})
		}

		if (!password) {
			return badRequest<ActionData>({
				success: false,
				intent: "reset-password",
				message: "Password is required",
				fieldErrors: {
					password: "Password is required",
				},
			})
		}

		const resetPasswordResponse = await resetPassword({
			email,
			token,
			password,
		})

		if (!resetPasswordResponse.success) {
			return badRequest<ActionData>({
				success: false,
				intent: "reset-password",
				message: resetPasswordResponse.message,
				fieldErrors: {
					password: resetPasswordResponse.message,
				},
			})
		}

		return redirect("/login?message=reset-password-success")
	}

	return badRequest<ActionData>({
		success: false,
		message: "Invalid intent",
	})
}

export default function ForgotPassword() {
	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"

	const [isEmailSent, setIsEmailSent] = React.useState(false)

	React.useEffect(() => {
		if (isSubmitting) return

		if (!fetcher.data) return

		if (fetcher.data.success) {
			if (fetcher.data.intent === "send-reset-password-email") {
				setIsEmailSent(true)
			}

			toast.success(fetcher.data.message)
		} else {
			toast.error(fetcher.data.message ?? "Something went wrong")
		}
	}, [isSubmitting, fetcher.data])

	return (
		<>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Forgot password
					</h1>
					<p className="text-muted-foreground text-sm">
						Enter your email below to reset your password
					</p>
				</div>

				<fetcher.Form
					method="post"
					className="w-full rounded bg-white px-6 pb-8 pt-6 text-black"
				>
					<div className="flex flex-col gap-4">
						<TextInput
							type="email"
							name="email"
							label="Email"
							autoFocus={isEmailSent ? false : true}
							placeholder="Enter your email"
							error={fetcher.data?.fieldErrors?.email}
							withAsterisk={false}
							required
						/>

						{isEmailSent ? (
							<>
								<NumberInput
									name="token"
									label="OTP"
									autoFocus={isEmailSent ? true : false}
									placeholder="Enter your OTP"
									error={fetcher.data?.fieldErrors?.token}
									withAsterisk={false}
									required
								/>

								<PasswordInput
									name="password"
									label="New password"
									placeholder="Enter your new password"
									error={fetcher.data?.fieldErrors?.password}
									withAsterisk={false}
									required
								/>
							</>
						) : null}
					</div>

					<div className="my-4 flex items-center justify-end">
						<Link
							to="/login"
							prefetch="intent"
							className="font-roboto text-sm font-semibold text-blue-500 hover:underline"
						>
							Login instead?
						</Link>
					</div>

					{isEmailSent ? (
						<Button
							fullWidth
							type="submit"
							loading={isSubmitting}
							name="intent"
							value="reset-password"
						>
							Reset password
						</Button>
					) : (
						<Button
							fullWidth
							type="submit"
							loading={isSubmitting}
							name="intent"
							value="send-reset-password-email"
						>
							Get OTP
						</Button>
					)}
				</fetcher.Form>
			</div>
		</>
	)
}
