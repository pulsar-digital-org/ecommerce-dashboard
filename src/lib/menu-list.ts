import { SquarePen, LayoutGrid, LucideIcon } from 'lucide-react'

type Submenu = {
	href: string
	label: string
	active?: boolean
}

type Menu = {
	href: string
	label: string
	active?: boolean
	icon: LucideIcon
	submenus?: Submenu[]
}

type Group = {
	groupLabel: string
	menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/',
					label: 'Dashboard',
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Contents',
			menus: [
				{
					href: '/products',
					label: 'Products',
					icon: SquarePen,
					submenus: [],
				},
			],
		},
	]
}
