'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CategoryForm from '../forms/category-form'
import GenericDialog from '../ui/generic-dialog'
import { forwardRef } from 'react'
import { ModalRef } from '../modals/type'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import client, {
	CategoryInterface,
	CategoryModifiable,
	categoryModifiableSchema,
} from '@/client/client'
import { useSession } from '@/hooks/use-session'
import { Button } from '../ui/button'

interface CategoryDialogProps {
	category?: CategoryInterface
	parent?: CategoryInterface
}

const CategoryDialog = forwardRef<ModalRef, CategoryDialogProps>(
	({ category, parent }, ref) => {
		const { token } = useSession()
		const queryClient = useQueryClient()

		const methods = useForm<CategoryModifiable>({
			resolver: zodResolver(categoryModifiableSchema),
			defaultValues: {
				name: category?.name ?? undefined,
				parentId: parent?.id ?? undefined,
			},
		})

		const { mutate: deleteCategory } = useMutation({
			mutationFn: async () => {
				if (!category) return
				const res = await client.api.categories[':id'].$delete(
					{
						param: { id: category.id },
					},
					{ headers: { Authorization: `Bearer ${token}` } }
				)

				const result = await res.json()

				return result
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['categories'] })
				toast.success('Category Deleted')
			},
			onError: () => {
				toast.error('Category deletion failed')
			},
		})

		const onSubmit = async (values: CategoryModifiable) => {
			let newCategory

			try {
				if (!category) {
					const res = await client.api.categories.$post(
						{ form: values },
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					)
					newCategory = (await res.json()).category
				} else {
					values.parentId = undefined
					const res = await client.api.categories[':id'].$put(
						{
							param: { id: category.id },
							form: values,
						},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					)
					newCategory = (await res.json()).category
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
				onSave={methods.handleSubmit(onSubmit, (e) => {
					throw new Error(JSON.stringify(e))
				})}
			>
				<Button onClick={() => deleteCategory()} variant="destructive">
					Delete Category
				</Button>
				<FormProvider {...methods}>
					<CategoryForm category={category} parent={parent} />
				</FormProvider>
			</GenericDialog>
		)
	}
)
CategoryDialog.displayName = 'Category Dialog'

export default CategoryDialog
