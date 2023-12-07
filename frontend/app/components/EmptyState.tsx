import {TicketIcon} from "@heroicons/react/24/solid"

type EmptyStateProps = {
	message: string
}

export function EmptyState({message}: EmptyStateProps) {
	return (
		<div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
			<TicketIcon className="mx-auto h-9 w-9 text-gray-500" />
			<span className="mt-4 block text-sm font-medium text-gray-500">
				{message}
			</span>
		</div>
	)
}
