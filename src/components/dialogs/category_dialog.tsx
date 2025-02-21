'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CategoryForm from '../forms/category-form'
import GenericDialog from '../ui/generic-dialog'
import { forwardRef } from 'react'
import { ModalRef } from '../modals/type'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import client, {
	CategoryInterface,
	CategoryModifiable,
	categoryModifiableSchema,
} from '@/client/client'

interface CategoryDialogProps {
	category?: CategoryInterface
	parent?: CategoryInterface
}

const CategoryDialog = forwardRef<ModalRef, CategoryDialogProps>(
	({ category, parent }, ref) => {
		const queryClient = useQueryClient()

		const methods = useForm<CategoryModifiable>({
			resolver: zodResolver(categoryModifiableSchema),
			defaultValues: {
				name: category?.name ?? '',
				parentId: parent?.id ?? undefined,
			},
		})

		const onSubmit = async (values: CategoryModifiable) => {
			let newCategory
			console.log('DSJKAJDK', values)

			try {
				if (!category) {
					const res = await client.api.categories.$post({ form: values })
					newCategory = (await res.json()).category
				} else {
					values.parentId = undefined
					const res = await client.api.categories[':id'].$put({
						param: { id: category.id },
						form: values,
					})
					newCategory = (await res.json()).category
					console.log(newCategory)
				}

				queryClient.invalidateQueries({
					queryKey: ['categories'],
				})

				queryClient.invalidateQueries({
					queryKey: ['category', category?.id],
				})

				toast.success('Category saved successfully!')
			} catch (err) {
				toast.error(`Failed to create category.`, { description: `${err}` })
			}

			methods.reset(newCategory)
		}

		return (
			<GenericDialog
				ref={ref}
				dialogLabels={{
					title: 'Category',
					description: 'Add a new category',
					submit: 'Add Category',
				}}
				onSave={methods.handleSubmit(onSubmit)}
			>
				<FormProvider {...methods}>
					<CategoryForm category={category} />
				</FormProvider>
			</GenericDialog>
		)
	}
)
CategoryDialog.displayName = 'Category Dialog'

export default CategoryDialog
