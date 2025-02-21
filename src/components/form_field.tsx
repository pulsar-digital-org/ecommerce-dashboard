import { Control, useFormContext } from 'react-hook-form';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { useEffect } from 'react';

type FormInputFieldProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	name: string;
	label: string;
	description?: string;
	placeholder?: string;
	type?: string;
	defaultValue?: string;
	disabled?: boolean;
	multiple?: boolean;
	accept?: string;
};

const FormInputField = ({
	label,
	description,
	placeholder,
	type,
	defaultValue,
	disabled,
	multiple,
	accept,
	...props
}: FormInputFieldProps) => {
	const { setValue } = useFormContext();

	useEffect(() => {
		if (defaultValue !== undefined) {
			setValue(props.name, defaultValue);
		}
	}, [defaultValue, props.name, setValue]);

	return (
		<FormField
			{...props}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						{type === 'file' ? (
							<Input
								type={type}
								{...field}
								multiple={multiple}
								accept={accept}
								value={undefined}
								onChange={e => {
									field.onChange(e.target.files);
								}}
							/>
						) : (
							<Input
								type={type}
								placeholder={placeholder}
								disabled={disabled}
								{...field}
								onChange={e => {
									const value =
										type === 'number' ? +e.target.value : e.target.value;
									field.onChange(value);
								}}
							/>
						)}
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default FormInputField;
