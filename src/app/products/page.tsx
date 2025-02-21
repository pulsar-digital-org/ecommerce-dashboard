'use client'

import client, { CategoryInterface } from '@/client/client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import CategoryItem from '@/components/category_item'
import CategoryDialog from '@/components/dialogs/category_dialog'
import { ModalRef } from '@/components/modals/type'
import ProductManage from '@/components/product_page/product_manage'
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Plus, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

const ProductsPage = () => {
	const dialogRef = useRef<ModalRef | null>(null)
	const [selected, setSelected] = useState<CategoryInterface | null>()

	const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
		queryKey: ['categories'],
		queryFn: async ({ pageParam }) => {
			const res = await client.api.categories.$get({
				query: { pageParam: `${pageParam}` },
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
		return data.pages.flatMap((page) => (page as { items: any[] }).items || [])
	}, [data])

	const handleFetchNextPage = async () => {
		if (!hasNextPage) return

		try {
			await fetchNextPage()
		} catch (err) {
			toast.error('No next page found', { description: `${err}` })
		}
	}

	return (
		<ContentLayout title="Nicolas Panco">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Products</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="py-8 p-2 sm:px-8 h-full grid gap-4 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
				<div className="flex flex-col p-2">
					<div className="flex justify-between items-center py-2 gap-4">
						<h6 className="text-sm font-medium py-2">Categories</h6>
						<Button
							onClick={() => dialogRef.current?.open()}
							disabled={isFetching}
						>
							<Plus />
						</Button>
					</div>
					<Separator />
					<div className="pt-2 flex flex-col gap-2">
						{isFetching
							? Array.from({ length: 3 }).map((_, index) => (
									<Skeleton className="h-8" key={index} />
								))
							: categories
									?.filter((category) => !category.parentCategory)
									.sort((item1, item2) => item1.createdAt - item2.createdAt)
									.map((category) => (
										<CategoryItem
											key={category.id}
											category={category}
											onSelect={setSelected}
											selectedCategoryId={selected ? selected.id : null}
										/>
									))}
						<LoadingButton
							backgroundColor="bg-muted-foreground/20"
							loading={isFetching}
							loaderColor="black"
							className={`bg-zinc-50 dark:bg-zinc-900 m-0 hover:bg-accent transition ease-in-out text-muted-foreground ${
								hasNextPage ? 'opacity-100' : 'opacity-0'
							}`}
							onClick={() => handleFetchNextPage()}
						>
							Load more... <RefreshCcw />
						</LoadingButton>
					</div>
				</div>
				{selected && (
					<ProductManage
						category={selected}
						className="col-span-1 lg:col-span-2 xl:col-span-3"
					/>
				)}
			</div>
			<CategoryDialog category={selected} ref={dialogRef} />
		</ContentLayout>
	)
}

export default ProductsPage
