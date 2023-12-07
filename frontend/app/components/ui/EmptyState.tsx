import {XIcon} from "lucide-react"
import {cn} from "~/utils/misc"

type EmptyStateProps = {
	label: string
	icon?: React.ReactNode
	className?: string
}
export function EmptyState(props: EmptyStateProps) {
	const {label, icon, className} = props
	return (
		<div
			className={cn(
				"relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center",
				className
			)}
		>
			<div className="flex items-center justify-center">
				{icon ?? <XIcon size={70} className="text-gray-600" />}
			</div>
			<span className="mt-4 block text-sm font-semibold text-gray-500">
				{label}
			</span>
		</div>
	)
}
