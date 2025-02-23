import { cn } from '@/lib/utils'
import {
	IconButton as IconButtonPrimitive,
	IconButtonProps,
} from '@radix-ui/themes'
import { forwardRef } from 'react'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	({ className, ...props }, ref) => (
		<IconButtonPrimitive
			ref={ref}
			variant="soft"
			className={cn('cursor-pointer transition-colors', className)}
			{...props}
		/>
	)
)
IconButton.displayName = IconButtonPrimitive.displayName

export { IconButton }
