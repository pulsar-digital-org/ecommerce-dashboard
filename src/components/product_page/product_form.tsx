import { Form, useFormContext } from 'react-hook-form'
import FormInputField from '../form_field'
import GenericFormSelect from '../ui/generic_select'
import FileSelect from '../ui/file_select'
import { CategoryInterface, ProductInterface } from '@/client/client'

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
	const fields = GetFields()

	console.log('PRODUCT CAT', categories)

	const handleImagesSelect = (images: string[]) => {
		methods.setValue('images', images)
	}
	const handleThumbnailSelect = (images: string[]) => {
		methods.setValue('thumbnail', images[0])
	}

	return (
		<Form>
			<div className="grid gap-4 py-4">
				{fields.map((item) => (
					<FormInputField key={item.name} control={methods.control} {...item} />
				))}

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
