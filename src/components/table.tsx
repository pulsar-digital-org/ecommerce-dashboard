'use client'

// todo:
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useMemo, useState } from 'react'
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
	UseInfiniteQueryOptions,
	useInfiniteQuery,
} from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export type GenericTableProps<T> = {
	infiniteQueryOptions: UseInfiniteQueryOptions
	columns: ColumnDef<T>[]
	entityName: string
	onAdd?: () => void
	onRowClick?: (row: T) => void
}

const GenericTable = <T extends { id: string }>({
	infiniteQueryOptions,
	columns,
	entityName,
	onAdd,
	onRowClick,
}: GenericTableProps<T>) => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [currentPage, setCurrentPage] = useState(1)

	const { data, hasNextPage, fetchNextPage, isFetching } =
		useInfiniteQuery(infiniteQueryOptions)

	// todo: fix this type also
	const tableData = useMemo(
		() =>
			isFetching
				? Array(10).fill({})
				: (data as { pages: any[] } | undefined)?.pages[currentPage - 1]
						?.items || [],
		[isFetching, data, currentPage]
	)
	const tableColumns = useMemo(
		() =>
			isFetching
				? columns.map((column) => ({
						...column,
						cell: () => <Skeleton className="h-[20px]" />,
					}))
				: columns,
		[columns, isFetching]
	)

	const table = useReactTable({
		data: tableData,
		columns: tableColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: { sorting, columnFilters, columnVisibility },
	})

	const handleNextPage = async () => {
		if (hasNextPage) await fetchNextPage()
		setCurrentPage((prev) => prev + 1)
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1)
	}

	return (
		<div className="w-full px-4">
			<div className="flex items-center justify-between py-4 gap-4">
				<Input
					placeholder={`Filter ${entityName}...`}
					value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
					onChange={(e) =>
						table.getColumn('id')?.setFilterValue(e.target.value)
					}
					className="max-w-sm"
				/>
				{onAdd && (
					<Button onClick={onAdd}>
						<Plus />
						Add {entityName}
					</Button>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									onClick={() => onRowClick && onRowClick(row.original)}
									className="cursor-pointer"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									No {entityName} found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handlePreviousPage}
					disabled={currentPage === 1 || isFetching}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleNextPage}
					disabled={isFetching || !hasNextPage}
				>
					Next
				</Button>
			</div>
		</div>
	)
}

export default GenericTable
