import type {LoaderArgs, SerializeFrom} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {Outlet} from "@remix-run/react"
import {
	BuildingIcon,
	LayoutDashboardIcon,
	Users2Icon,
	UsersIcon,
} from "lucide-react"
import type {NavMenuItems} from "~/components/Nav"
import {Nav} from "~/components/Nav"
import {isOrganizer, isStudent, requireUserId} from "~/session.server"

export const ROUTE = "/admin"

export type AppLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	await requireUserId(request)

	if (await isStudent(request)) {
		return redirect("/student")
	} else if (await isOrganizer(request)) {
		return redirect("/organizer")
	}

	return json({})
}

const navMenu: NavMenuItems = [
	{
		title: "Manage",
		items: [
			{
				name: "Sports",
				href: `${ROUTE}`,
				icon: <LayoutDashboardIcon width={18} />,
			},
			{
				name: "Teams",
				href: `${ROUTE}/teams`,
				icon: <LayoutDashboardIcon width={18} />,
			},
			{
				name: "Organizers",
				href: `${ROUTE}/organizers`,
				icon: <UsersIcon width={18} />,
			},
			{
				name: "Students",
				href: `${ROUTE}/students`,
				icon: <Users2Icon width={18} />,
			},
			{
				name: "Stadiums",
				href: `${ROUTE}/stadiums`,
				icon: <BuildingIcon width={18} />,
			},
		],
	},
]

export default function AppLayout() {
	return (
		<>
			<div>
				<Nav menuItems={navMenu} />

				<div className="min-h-screen bg-stone-50 sm:pl-64">
					<Outlet />
				</div>
			</div>
		</>
	)
}
