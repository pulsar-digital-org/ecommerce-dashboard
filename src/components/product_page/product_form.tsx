import { Form, useFormContext } from 'react-hook-form'
import FormInputField from '../form_field'
import GenericFormSelect from '../ui/generic_select'
import FileSelect from '../ui/file_select'
import { CategoryInterface, ProductInterface } from '@/client/client'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'

const GetFields = () => {
	return [
		{
			name: 'name',
			label: 'Name',
			description: 'Enter the name of the product.',
			placeholder: 'Enter product name',
			type: 'text',
		},
		{
			name: 'description',
			label: 'Description',
			description: 'Provide a brief description of the product.',
			placeholder: 'Enter product description',
			type: 'text',
		},
		{
			name: 'stock',
			label: 'Stock',
			description: 'Enter the available stock.',
			placeholder: 'Enter stock quantity',
			type: 'number',
		},
	]
}

const ProductForm = ({
	categories,
	product,
	defaultCategory,
}: {
	categories: CategoryInterface[]
	product: ProductInterface
	defaultCategory?: CategoryInterface
}) => {
	const methods = useFormContext()

	const handleImagesSelect = (images: string[]) => {
		methods.setValue('images', images)
	}

	const handleThumbnailSelect = (images: string[]) => {
		methods.setValue('thumbnail', images[0])
	}

	return (
		<Form>
			<div className="grid gap-4 py-4">
				<FormField
					control={methods.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Product #1"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								You can also add multiple lines.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="This is a description of product #1"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								You can also add multiple lines.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="stock"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Stock</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" {...field} />
							</FormControl>
							<FormDescription>Enter the available stock.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<GenericFormSelect
					options={categories}
					defaultCategory={defaultCategory}
					defaultSelected={product?.categories}
				/>

				<FileSelect
					label="Thumbnail"
					defaultImages={product?.thumbnail ? [product?.thumbnail] : []}
					onSelect={handleThumbnailSelect}
				/>

				<FileSelect
					isMulti
					label="Images"
					defaultImages={product?.images}
					onSelect={handleImagesSelect}
				/>
			</div>
		</Form>
	)
}

export default ProductForm
