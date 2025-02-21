'use client'

import { useRef } from 'react'
import GenericTable from '@/components/table'
import { useRouter } from 'next/navigation'
import { productColumns } from '@/components/columns/product'
import ProductDialog from './product_dialog'
import { ModalRef } from '../modals/type'
import client, { CategoryInterface, ProductInterface } from '@/client/client'
import { infiniteQueryOptions } from '@tanstack/react-query'

type ProductManageProps = {
	category: CategoryInterface
	className?: string
}

const ProductManage = ({ category, className }: ProductManageProps) => {
	const router = useRouter()

	const dialogRef = useRef<ModalRef | null>(null)

	const handleRowClick = (row: ProductInterface) => {
		router.push(`/dashboard/products/${row.id}`)
	}

	const handleOpenChange = () => {
		dialogRef.current?.open()
	}

	return (
		<div className={className}>
			<GenericTable
				infiniteQueryOptions={infiniteQueryOptions(
					infiniteQueryOptions({
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
				)}
				columns={productColumns}
				entityName="product"
				onRowClick={handleRowClick}
				onAdd={handleOpenChange}
			/>
			<ProductDialog category={category} ref={dialogRef} />
		</div>
	)
}

export default ProductManage
