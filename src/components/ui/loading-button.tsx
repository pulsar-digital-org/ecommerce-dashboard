import { ReactNode, FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LoaderIcon from '@/icons/loader';

export interface LoadingButtonProps extends ButtonProps {
	loading: boolean;
	children: ReactNode;
	loaderColor: string;
	backgroundColor?: string;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
	loading,
	children,
	loaderColor: color,
	backgroundColor = 'bg-black/50',
	className,
	...props
}) => {
	return (
		<Button
			{...props}
			className={cn('w-full relative overflow-hidden', className)}
		>
			<span
				className={`transition-all ease-in-out duration-200 flex ${
					loading ? 'scale-75' : ''
				}`}
			>
				{children}
			</span>

			<AnimatePresence>
				{loading && (
					<motion.span
						animate={{ opacity: 1, scale: 1 }}
						initial={{ opacity: 0, scale: 1.2 }}
						exit={{ opacity: 0, scale: 1.2 }}
						transition={{
							duration: 0.2,
							ease: 'easeInOut'
						}}
						className={`absolute flex justify-center items-center w-full h-full ${backgroundColor}`}
					>
						<LoaderIcon color={color} />
					</motion.span>
				)}
			</AnimatePresence>
		</Button>
	);
};
