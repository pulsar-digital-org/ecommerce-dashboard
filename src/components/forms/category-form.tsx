import { Form, useFormContext } from 'react-hook-form'
import FormInputField from '../form_field'
import FileSelect from '../ui/file_select'
import { CategoryInterface } from '@/client/client'

const GetFields = (
	category?: CategoryInterface,
	parent?: CategoryInterface
) => [
	{
		name: 'name',
		label: 'Name',
		description: 'Enter the name of the category.',
		placeholder: 'Enter category name',
		type: 'text',
		defaultValue: category?.name || '',
	},
	{
		name: 'parentId',
		label: 'Parent',
		description: '',
		placeholder: '',
		type: 'text',
		defaultValue: parent?.id || '',
		disabled: true,
	},
]

const CategoryForm = ({
	category,
	parent,
}: {
	category?: CategoryInterface
	parent?: CategoryInterface
}) => {
	const methods = useFormContext()
	const fields = GetFields(category, parent)

	const handleImageSelect = (image: string[]) => {
		methods.setValue('imageId', image[0])
	}

	return (
		<Form>
			<div className="grid gap-4 py-4">
				{fields.map((item, index) => (
					<FormInputField key={index} control={methods.control} {...item} />
				))}

				{/* {selectFields.map((item, index) => (
					<GenericFormSelect
						key={index}
						options={category?.subcategories?.map(
							(category: Category) => category.name
						)}
						{...item}
					/>
				))} */}

				<FileSelect
					label="Category thumbnail"
					defaultImages={category?.thumbnail ? [category.thumbnail] : []}
					isMulti={false}
					onSelect={handleImageSelect}
				/>
			</div>
		</Form>
	)
}

export default CategoryForm
