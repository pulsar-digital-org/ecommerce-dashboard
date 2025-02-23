'use client'

import { CategoryInterface } from '@/client/client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import CategoryList from '@/components/category-list'
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
import { IconButton } from '@/components/ui/icon-button'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { useRef, useState } from 'react'

const ProductsPage = () => {
	const dialogRef = useRef<ModalRef | null>(null)
	const [selected, setSelected] = useState<CategoryInterface | undefined>()
	const [editCategory, setEditCategory] = useState<
		CategoryInterface | undefined
	>()
	const [parentCategory, setParentCategory] = useState<
		CategoryInterface | undefined
	>()

	const editHandler = (
		category?: CategoryInterface,
		parent?: CategoryInterface
	) => {
		console.log('EDIT', category, parent)
		setEditCategory(category)
		setParentCategory(parent)
		dialogRef.current?.open()
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
						<h6 className="text-xl font-bold py-2">Categories</h6>
						<IconButton onClick={() => editHandler()}>
							<Icon icon="majesticons:plus" className="text-inherit" />
						</IconButton>
					</div>
					<CategoryList
						className="pt-4"
						editHandler={editHandler}
						selectedCategory={selected}
						setSelectedCategory={setSelected}
					/>
				</div>
				{selected && (
					<ProductManage
						category={selected}
						className="col-span-1 lg:col-span-2 xl:col-span-3"
					/>
				)}
			</div>
			<CategoryDialog
				ref={dialogRef}
				category={editCategory}
				parent={parentCategory}
			/>
		</ContentLayout>
	)
}

export default ProductsPage
