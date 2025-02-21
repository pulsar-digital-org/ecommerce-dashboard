import {
	forwardRef,
	HTMLAttributes,
	useImperativeHandle,
	useState
} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from './dialog';
import { ModalRef } from '../modals/type';
import { LoadingButton } from './loading_button';
import { toast } from 'sonner';

export type GenericDialogLabelProps = {
	title: string;
	description: string;
	submit: string;
};

type GenericDialogProps = {
	dialogLabels: GenericDialogLabelProps;
	onSave: () => Promise<void>;
	children: React.ReactNode | undefined;
} & HTMLAttributes<HTMLDivElement>;

const GenericDialog = forwardRef<ModalRef, GenericDialogProps>(
	({ dialogLabels, onSave, children, ...rest }, ref) => {
		const [isOpen, setIsOpen] = useState<boolean>(false);
		const { title, description, submit } = dialogLabels;
		const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

		const close = async () => {
			setIsOpen(false);
		};

		useImperativeHandle(ref, () => ({
			open: () => setIsOpen(true),
			close,
			toggle: () => setIsOpen(!isOpen),
			isOpen: () => isOpen
		}));

		const handleSave = async () => {
			setIsSubmitting(true);
			try {
				await onSave();

				setIsOpen(false);
			} catch (err) {
				toast.error('Submission failed.', { description: `${err}` });
			} finally {
				setIsSubmitting(false);
			}
		};

		return (
			<Dialog open={isOpen} {...rest} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-[650px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">{children}</div>
					<DialogFooter>
						<LoadingButton
							loading={isSubmitting}
							loaderColor="white"
							onClick={handleSave}
						>
							{submit}
						</LoadingButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
);
GenericDialog.displayName = 'Generic Dialog';

export default GenericDialog;
