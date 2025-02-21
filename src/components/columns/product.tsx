import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductInterface } from '@/client/client'

export const productColumns: ColumnDef<ProductInterface>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>,
	},
	// {
	// 	accessorKey: 'price',
	// 	header: 'Active price',
	// 	cell: ({ row }) => (
	// 		<div className="capitalize">
	// 			{(row.getValue('activePrice') as Price)?.price}
	// 		</div>
	// 	)
	// },
	{
		accessorKey: 'stock',
		header: 'Stock',
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue('stock')}</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Created at
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="lowercase">
				{new Date(row.getValue('createdAt')).toLocaleString()}
			</div>
		),
	},
]
