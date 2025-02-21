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

type ProductDialogProps = {
	product?: ProductInterface
	category?: CategoryInterface
}

const ProductDialog = forwardRef<ModalRef, ProductDialogProps>(
	({ product, category }, ref) => {
		const queryClient = useQueryClient()

		const methods = useForm<ProductModifiable>({
			resolver: zodResolver(productModifiableSchema),
			defaultValues: product ?? undefined,
		})

		useEffect(() => {}, [product, methods])

		const onSubmit = async (values: ProductModifiable) => {
			let newProduct
			try {
				if (!product) {
					const res = await client.api.products.$post({ form: values })
					newProduct = (await res.json()).product
				} else {
					const res = await client.api.products[':id'].$put({
						param: { id: product.id },
						form: values,
					})
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

			methods.reset(newProduct)
		}

		return (
			<GenericDialog
				ref={ref}
				dialogLabels={{
					title: 'Product',
					description: 'Create/Update product',
					submit: 'Save product',
				}}
				onSave={methods.handleSubmit(onSubmit, (err) => console.log(err))}
			>
				<FormProvider {...methods}>
					<ProductForm
						categories={product?.categories}
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
