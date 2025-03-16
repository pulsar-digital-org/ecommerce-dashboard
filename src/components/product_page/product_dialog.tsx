// todo:
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { FormProvider, useForm } from 'react-hook-form'
import GenericDialog from '../ui/generic-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import ProductForm from './product_form'
import { forwardRef, useEffect, useMemo } from 'react'
import { ModalRef } from '../modals/type'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import client, {
	CategoryInterface,
	ProductInterface,
	ProductModifiable,
	productModifiableSchema,
} from '@/client/client'
import { useSession } from '@/hooks/use-session'

type ProductDialogProps = {
	product?: ProductInterface
	category?: CategoryInterface
}

const ProductDialog = forwardRef<ModalRef, ProductDialogProps>(
	({ product, category }, ref) => {
		const { token } = useSession()
		const queryClient = useQueryClient()

		const methods = useForm<ProductModifiable>({
			resolver: zodResolver(productModifiableSchema),
			defaultValues: product ?? undefined,
		})

		const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
			queryKey: ['categories'],
			queryFn: async ({ pageParam }) => {
				const res = await client.api.categories.$get({
					query: {
						pageParam: `${pageParam}`,
					},
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

		useEffect(() => {
			console.log(product)
		}, [product, methods])

		const onSubmit = async (values: ProductModifiable) => {
			let newProduct
			console.log('P: ', values)

			try {
				if (!product) {
					console.log('CREATE')
					const res = await client.api.products.$post(
						{ json: values },
						{ headers: { Authorization: `Bearer ${token}` } }
					)
					newProduct = (await res.json()).product
				} else {
					console.log('UPDATE', values)
					const res = await client.api.products[':id'].$put(
						{
							param: { id: product.id },
							json: values,
						},
						{ headers: { Authorization: `Bearer ${token}` } }
					)
					newProduct = (await res.json()).product
				}

				queryClient.invalidateQueries({
					queryKey: ['products'],
				})

				queryClient.invalidateQueries({
					queryKey: ['product', product?.id],
				})

				toast.success('Product saved successfully!')
			} catch (err) {
				toast.error(`Failed to create product.`, { description: `${err}` })
			}

			if (product) {
				methods.reset(newProduct)
				return
			}

			methods.reset({})
		}

		return (
			<GenericDialog
				ref={ref}
				dialogLabels={{
					title: 'Product',
					description: 'Create/Update product',
					submit: 'Save product',
				}}
				onSave={methods.handleSubmit(onSubmit, (e) => {
					throw new Error(JSON.stringify(e))
				})}
			>
				<FormProvider {...methods}>
					<ProductForm
						categories={categories}
						product={product}
						defaultCategory={category}
					/>
				</FormProvider>
			</GenericDialog>
		)
	}
)

ProductDialog.displayName = 'Product Dialog'

export default ProductDialog
