// TODO: this needs to be reworked

'use client'

import React, { useRef, useState } from 'react'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronDown, ChevronLeft, Plus } from 'lucide-react'
import CategoryDialog from './dialogs/category_dialog'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { ModalRef } from './modals/type'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import client, { CategoryInterface } from '@/client/client'

interface CategoryItemProps {
	category: CategoryInterface
	onSelect: (category: CategoryInterface) => void
	selectedCategoryId: string | null
}

const CategoryItem: React.FC<CategoryItemProps> = ({
	category,
	onSelect,
	selectedCategoryId,
}) => {
	const queryClient = useQueryClient()
	const dialogRef = useRef<ModalRef | null>(null)

	const [categories, setCategories] = useState<CategoryInterface[]>([])
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { mutate: getCategory, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const res = await client.api.categories[':id'].$get({ param: { id } })
			return await res.json()
		},
		onSuccess: (data) => {
			setCategories((prev) => [...prev, data.category])
		},
		onError: (err) => {
			toast.error(`Could not get category.`, {
				description: `Something went wrong. ${err}`,
			})
		},
	})

	const { mutate: deleteCategory } = useMutation({
		mutationFn: async (id: string) => {
			const res = await client.api.categories[':id'].$delete({ param: { id } })
			return await res.json()
		},
		onSuccess: () => {
			setCategories([])
			handleCategoryClick() // TODO:
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			})
		},
		onError: (err) => {
			toast.error(`Could delete category.`, {
				description: `Something went wrong. ${err}`,
			})
		},
	})

	const handleCategoryClick = () => {
		onSelect(category)
		if (categories.length > 0) return

		category.subcategories?.map((subCat: Category) => {
			getCategory(subCat.id)
		})
	}

	const handleOpenChange = () => {
		if (selectedCategoryId === category.id && isOpen) {
			setIsOpen(false)
			return
		}

		setIsOpen(true)
	}

	return (
		<>
			<Collapsible open={isOpen} onOpenChange={handleOpenChange}>
				<CollapsibleTrigger className="w-full" onClick={handleCategoryClick}>
					<ContextMenu modal={false}>
						<ContextMenuTrigger
							className={`[&_svg]:size-4 [&_svg]:shrink-0 flex justify-between items-center text-xs font-medium text-sidebar-accent-foreground hover:bg-accent w-full text-left py-2 px-2 rounded transition ease-in-out ${
								selectedCategoryId === category.id ? 'bg-accent' : ''
							}`}
						>
							{category.name}
							{isOpen ? <ChevronDown /> : <ChevronLeft />}
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem
								onClick={(e) => {
									e.preventDefault()
									dialogRef.current?.open()
								}}
							>
								Edit
							</ContextMenuItem>
							<ContextMenuItem onClick={() => deleteCategory(category.id)}>
								Delete
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="ml-4 flex flex-col gap-2 mt-2 after:w-1 after:bg-muted after:absolute relative after:inset-px after:-left-2">
						{isPending ? (
							Array.from({ length: 3 }).map((_, index) => (
								<Skeleton className="h-8" key={index} />
							))
						) : (
							<>
								{categories?.map((sub) => (
									<CategoryItem
										key={sub.id}
										category={sub}
										onSelect={onSelect}
										selectedCategoryId={selectedCategoryId}
									/>
								))}
								<Button
									className="py-2 px-2 justify-between bg-transparent hover:bg-accent transition ease-in-out text-muted-foreground"
									onClick={() => dialogRef.current?.open()}
								>
									add category
									<Plus />
								</Button>
							</>
						)}
					</div>
				</CollapsibleContent>
			</Collapsible>
			<CategoryDialog ref={dialogRef} parent={category} category={category} />
		</>
	)
}

export default CategoryItem
