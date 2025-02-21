'use client';

// imports
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

// api
import { orderGetQuery, orderPost } from '@/api/order';

// types
import { ModalRef } from './type';
import { AddressType } from '@/types/address';

// ui components + hooks
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';

// custom components
import Loader from '@/components/loader/loader';
import BasketAddress from '@/components/basketAddress';
import ProductsTable from '@/components/base/basket/productsTable';

const BasketModal = forwardRef<ModalRef, React.HTMLAttributes<HTMLDivElement>>(
	({}, ref) => {
		const { user } = useSession();

		const [isOpen, setIsOpen] = useState<boolean>(false);

		const [selectedTab, setSelectedTab] = useState('basket');

		const { data: order } = useQuery(orderGetQuery(user?.activeOrder?.id));

		const { mutate: postOrder, isPending: isOrdering } = useMutation({
			mutationFn: orderPost,
			onSuccess: () => {
				// TODO: redirect user to order confirmation page
			},
			onError: err => {
				toast.error('Error sending order.', {
					description: `Something went wrong. ${err}`
				});
			}
		});

		const tabSelectHandler = (tab: string) => {
			if (!order || order.orderItems.length <= 0) return;
			setSelectedTab(tab);
		};

		useImperativeHandle(ref, () => ({
			open: () => setIsOpen(true),
			close: async () => {
				setIsOpen(false);
				await new Promise(resolve => setTimeout(resolve, 1200));
			},
			toggle: () => setIsOpen(!isOpen),
			isOpen: () => isOpen
		}));

		return (
			<AnimatePresence>
				{isOpen && (
					<div className="fixed top-0 right-0 w-[420px] h-full z-[9]">
						<motion.div
							layoutId="right-modal"
							className="h-full bg-white absolute w-full flex flex-col px-6 after:content-['*'] after:pb-6 before:content-['*'] before:pb-16"
							initial={{ left: '100%' }}
							animate={{ left: '0%' }}
							exit={{ left: '100%' }}
							transition={{ duration: 1.2, ease: [0.9, 0, 0.2, 1] }}
							layout
						>
							<Tabs
								value={selectedTab}
								onValueChange={setSelectedTab}
								className="flex flex-col"
							>
								<TabsList className="grid grid-cols-3 bg-black/10">
									<TabsTrigger value="basket">Basket</TabsTrigger>
									<TabsTrigger
										value="address"
										disabled={!order || order.orderItems?.length <= 0}
									>
										Address
									</TabsTrigger>
									<TabsTrigger
										value="summary"
										disabled={!order || order.orderItems?.length <= 0}
									>
										Summary
									</TabsTrigger>
								</TabsList>
								<TabsContent
									className="flex flex-col gap-12 w-full pt-4"
									value="basket"
								>
									<h1 className="text-xl font-bold text-black">Basket</h1>
									<ProductsTable order={order} />
									<div className="flex justify-end">
										<Button onClick={() => tabSelectHandler('address')}>
											Continue
										</Button>
									</div>
								</TabsContent>
								<TabsContent
									className="flex flex-col gap-12 w-full pt-4 overflow-auto"
									value="address"
								>
									<h1 className="text-xl font-bold text-black">Address</h1>
									<BasketAddress type={AddressType.Billing} />
									<BasketAddress type={AddressType.Shipping} />
									<div className="flex justify-end">
										<Button onClick={() => tabSelectHandler('summary')}>
											Continue
										</Button>
									</div>
								</TabsContent>
								<TabsContent value="summary">
									<div className="flex flex-col gap-12 w-full pt-4">
										<h1 className="text-xl font-bold text-black">Summary</h1>
										<div className="flex justify-end">
											<Button
												className="bg-black text-white font-bold hover:bg-black/80"
												onClick={() => {
													postOrder(order.id);
												}}
												disabled={isOrdering}
											>
												{isOrdering ? <Loader /> : 'Order'}
											</Button>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		);
	}
);

BasketModal.displayName = 'BasketModal';

export default BasketModal;
