'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { Button } from '../ui/button'
import { ModalRef } from '../modals/type'
import ProductDialog from './product_dialog'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import Loader from '@/icons/loader'
import client from '@/client/client'
import { useSession } from '@/hooks/use-session'

type ProductPreviewProps = {
	productId: string
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ productId }) => {
	const { token } = useSession()
	const queryClient = useQueryClient()
	const dialogRef = useRef<ModalRef | null>(null)

	const { data: product, isLoading } = useQuery({
		queryKey: ['product', productId],
		queryFn: async () => {
			const res = await client.api.products[':id'].$get({
				param: { id: productId },
			})

			const result = await res.json()

			return result.product
		},
	})

	const { mutate: deleteProduct } = useMutation({
		mutationFn: async () => {
			const res = await client.api.products[':id'].$delete(
				{
					param: { id: productId },
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			const result = await res.json()

			return result
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
			toast.success('Product Deleted')
		},
		onError: () => {
			toast.error('Product deletion failed')
		},
	})

	if (isLoading) {
		return (
			<div className="flex h-full justify-center items-center">
				<Loader />
			</div>
		)
	}

	if (!product) {
		return (
			<div className="flex h-full justify-center items-center">
				Product not found
			</div>
		)
	}

	console.log(product)

	return (
		<div className="p-4 py-8 flex flex-col gap-8">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold whitespace-pre-line">
					{product.name}
				</h2>
				<div className="flex gap-4">
					<Button onClick={() => dialogRef.current?.open()}>Edit</Button>
					<Button variant="destructive" onClick={() => deleteProduct()}>
						Delete
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
				<div className="flex flex-col gap-2">
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Product name</h4>
						<p className="text-sm text-muted-foreground whitespace-pre-line">
							{product.name}
						</p>
					</div>
					<Separator className="my-4 w-full" />
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Description</h4>
						<p className="text-sm text-muted-foreground whitespace-pre-line">
							{product.description}
						</p>
					</div>
					<Separator className="my-4 w-full" />
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Categories</h4>
						<span className="flex gap-2 flex-wrap">
							{product.categories?.map((cat) => (
								<span
									key={cat.id}
									className="py-1 text-xs px-3 rounded transition text-muted-foreground bg-muted-foreground/10"
								>
									{cat.name}
								</span>
							))}
						</span>
					</div>
					<Separator className="my-4 w-full" />
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Stock</h4>
						<p className="text-sm text-muted-foreground">{product.stock}</p>
					</div>
					<Separator className="my-4 w-full" />
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Updated at</h4>
						<p className="text-sm text-muted-foreground">
							{new Date(product.updatedAt).toLocaleString()}
						</p>
					</div>
					<Separator className="my-4 w-full" />
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">Created at</h4>
						<p className="text-sm text-muted-foreground">
							{new Date(product.createdAt).toLocaleString()}
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					{product.images
						?.sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime()
						)
						.map((image) => (
							<div
								key={image.id}
								className="relative flex flex-col justify-between bg-muted-foreground/10 rounded-lg items-center py-3 px-3 w-full gap-4"
							>
								<div className="rounded-md w-full overflow-hidden relative">
									<img
										src={image.url}
										alt={image.name}
										className="object-cover w-full h-full"
									/>
								</div>
							</div>
						))}
				</div>
			</div>
			<ProductDialog ref={dialogRef} product={product} />
		</div>
	)
}

export default ProductPreview
