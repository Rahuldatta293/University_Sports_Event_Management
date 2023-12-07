import type {LoaderArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {EmptyState} from "~/components/EmptyState"
import {TailwindContainer} from "~/components/TailwindContainer"
import {requireUserId} from "~/session.server"

export const loader = async ({request}: LoaderArgs) => {
	await requireUserId(request)
	return json({})
}

export default function ParticipantDashboard() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div>
				<TailwindContainer>
					<div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
						<h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
							Super Admin Dashboard
						</h2>

						<div className="mt-8">
							<EmptyState message="To be Implemented" />
						</div>
					</div>
				</TailwindContainer>
			</div>
		</div>
	)
}
