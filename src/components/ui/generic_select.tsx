// TODO:

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CategoryInterface } from '@/client/client'

const GenericFormSelect = ({
	options,
	defaultCategory,
	defaultSelected,
}: {
	options: CategoryInterface[]
	defaultCategory?: CategoryInterface
	defaultSelected?: CategoryInterface[]
}) => {
	const { control, setValue } = useFormContext()
	const [selected, setSelected] = useState<string[]>([])

	useEffect(() => {
		const s = []

		if (defaultCategory) s.push(defaultCategory.id)

		defaultSelected?.map((c) => s.push(c.id))

		setSelected(s)
	}, [defaultCategory, defaultSelected])

	useEffect(() => {
		setValue('categories', selected)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected])

	return (
		<FormField
			control={control}
			name="language"
			render={() => (
				<FormItem className="flex flex-col">
					<FormLabel>Categories</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant="outline"
									role="combobox"
									className={cn(
										'justify-between',
										selected?.length === 0 && 'text-muted-foreground'
									)}
								>
									<span className="flex gap-2 flex-wrap">
										{selected
											? selected.map((categoryId: string | undefined) => {
													if (!categoryId) return
													return (
														<span
															key={categoryId}
															className={`py-1 px-3 rounded transition ${
																categoryId === defaultCategory?.id
																	? 'text-muted-foreground/50 bg-muted-foreground/5 hover:bg-muted-foreground/5'
																	: 'text-muted-foreground bg-muted-foreground/10 hover:bg-muted-foreground/20'
															}`}
															onClick={(e) => {
																e.preventDefault()

																if (categoryId === defaultCategory?.id) {
																	return
																}
																setSelected(
																	selected.filter((item) => item !== categoryId)
																)
															}}
														>
															{
																options?.find((item) => item.id === categoryId)
																	?.name
															}
														</span>
													)
												})
											: 'Select categories'}
									</span>
									<ChevronsUpDown className="opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0 pointer-events-auto">
							<Command>
								<CommandInput
									placeholder="Search category..."
									className="h-9"
								/>
								<CommandList>
									<CommandEmpty>No categories found.</CommandEmpty>
									<CommandGroup>
										{options
											?.filter((item) => !selected.includes(item.id))
											.map((option) => (
												<CommandItem
													value={option.name}
													key={option.id}
													onSelect={() => {
														setSelected(
															selected.includes(option.id)
																? selected.filter((i) => i !== option.id)
																: [...selected, option.id]
														)
													}}
												>
													{option.name}
												</CommandItem>
											))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<FormDescription>
						These are the categories for the product.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default GenericFormSelect
