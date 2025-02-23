'use client'

import React, { useEffect, useMemo } from 'react'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import client, { CategoryInterface } from '@/client/client'
import { IconButton } from './ui/icon-button'
import { cn } from '@/lib/utils'
import SpinnerIcon from '@/icons/spinner'
import { Separator } from './ui/separator'

interface CategoryItemProps {
	parent?: CategoryInterface
	className?: string
	editHandler: (
		category?: CategoryInterface,
		parent?: CategoryInterface
	) => void
	selectedCategory?: CategoryInterface
	setSelectedCategory: (category: CategoryInterface) => void
}

const CategoryList: React.FC<CategoryItemProps> = ({
	parent,
	className,
	editHandler,
	selectedCategory,
	setSelectedCategory,
}) => {
	const { data, isFetching, refetch, fetchNextPage, hasNextPage } =
		useInfiniteQuery({
			queryKey: ['categories', parent?.id ?? 'null'],
			queryFn: async ({ pageParam }) => {
				const res = await client.api.categories.$get({
					query: { parentId: parent?.id ?? 'null', pageParam: `${pageParam}` },
				})
				const result = await res.json()

				const nextId = result.hasNextPage ? pageParam + 1 : undefined
				const previousId = pageParam > 1 ? pageParam - 1 : undefined

				return { items: result.items, nextId, previousId }
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage) => lastPage.nextId,
			getPreviousPageParam: (firstPage) => firstPage.previousId,
		})

	const categories = useMemo(() => {
		if (!data || !data.pages) return []
		return data.pages.flatMap((page) => page.items || [])
	}, [data])

	useEffect(() => {
		if (hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching])

	return (
		<div className={cn('pt-2 flex flex-col gap-2', className)}>
			{isFetching ? (
				<div className="flex justify-center items-center w-full h-10 text-indigo-400">
					<SpinnerIcon />
				</div>
			) : categories.length <= 0 ? (
				<div className="flex justify-between px-2 py-1 rounded-md items-center h-10">
					<div className="flex gap-2 items-center">
						<IconButton
							onClick={() => editHandler(undefined, parent)}
							className="m-0"
						>
							<Icon icon="majesticons:plus" className="text-inherit" />
						</IconButton>
						<p className="text-sm text-muted-foreground">
							No categories found.
						</p>
					</div>
					<IconButton
						variant="ghost"
						size="3"
						onClick={() => refetch()}
						className="m-0"
					>
						<Icon icon="majesticons:reload" className="text-inherit" />
					</IconButton>
				</div>
			) : (
				categories.map((category) => (
					<Collapsible key={category.id}>
						<CollapsibleTrigger
							onClick={() => setSelectedCategory(category)}
							className="w-full"
							asChild
						>
							<div
								className={`flex text-sm justify-between pr-1 pl-2 py-1 cursor-pointer transition-colors rounded-md items-center ${selectedCategory?.id === category.id ? 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 font-bold text-indigo-900/90 dark:text-indigo-100/90' : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 font-bold text-slate-400 dark:text-slate-600'}`}
							>
								{category.name}
								<IconButton
									onClick={(e) => {
										e.preventDefault()
										editHandler(category)
									}}
								>
									<Icon
										icon="majesticons:edit-pen-2"
										className="text-inherit"
									/>
								</IconButton>
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="relative">
							<div className="absolute left-2 h-full w-full pointer-events-none">
								<Separator color="gray" orientation="vertical" size="4" />
							</div>
							<CategoryList
								className="pl-4"
								parent={category}
								editHandler={editHandler}
								selectedCategory={selectedCategory}
								setSelectedCategory={setSelectedCategory}
							/>
						</CollapsibleContent>
					</Collapsible>
				))
			)}
		</div>
	)
}

export default CategoryList
