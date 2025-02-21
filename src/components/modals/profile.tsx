'use client';

// todo:
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useSession } from '@/hooks/useSession';
import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { ordersGetQuery } from '@/api/order';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '../ui/table';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ModalRef } from './type';
import { Order } from '@/types/order';

const ProfileModal = forwardRef<ModalRef, React.HTMLAttributes<HTMLDivElement>>(
	({}, ref) => {
		const { user, logout } = useSession();

		const [isOpen, setIsOpen] = useState<boolean>(false);

		const close = async () => {
			setIsOpen(false);
			await new Promise(resolve => setTimeout(resolve, 1200));
		};

		useImperativeHandle(ref, () => ({
			open: () => setIsOpen(true),
			close,
			toggle: () => setIsOpen(!isOpen),
			isOpen: () => isOpen
		}));

		const handleLogout = async () => {
			await close();

			logout();
		};

		const { data: orders, isFetching } = useInfiniteQuery(
			ordersGetQuery(user?.id)
		);

		// todo: fix this type after the type of useInfiniteQuery is fixed
		const ordersList =
			orders?.pages.flatMap(page => (page as { items: any[] }).items) ||
			// .filter(order => order.status !== OrderStatus.draft)
			[];

		return (
			<AnimatePresence>
				{isOpen && (
					<div
						className={`fixed top-0 right-0 w-full md:w-[420px] h-full z-[9]`}
					>
						<motion.div
							className="h-full bg-white absolute w-full flex pt-16 px-6 pb-6"
							initial={{ left: '100%' }}
							animate={{ left: '0%' }}
							exit={{ left: '100%' }}
							transition={{
								duration: 1.2,
								ease: [0.9, 0, 0.2, 1]
							}}
						>
							<div className="flex flex-col justify-between h-full w-full gap-6">
								<div className="flex flex-col gap-6 overflow-y-auto w-full">
									<h1 className="text-xl font-bold text-black">User profile</h1>
									<h2 className="text-lg font-bold text-black">Orders</h2>
									<Table>
										<TableCaption>A list of your recent orders.</TableCaption>
										<TableHeader>
											<TableRow className="hover:bg-black text-white bg-black">
												<TableHead className="w-[200px] text-white font-bold">
													Order time
												</TableHead>
												<TableHead className="text-right text-white font-bold">
													Status
												</TableHead>
												<TableHead className="text-white font-bold">
													Price
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{ordersList.map((order: Order) =>
												isFetching ? (
													<TableRow
														key={order.id}
														className="hover:bg-gray-100"
													>
														<TableCell className="font-medium text-black">
															<Skeleton className="h-[20px] w-full" />
														</TableCell>
														<TableCell className="hover:bg-gray-100 text-black">
															<Skeleton className="h-[20px] w-full" />
														</TableCell>
														<TableCell className="text-right hover:bg-gray-100 text-black">
															<Skeleton className="h-[20px] w-full" />
														</TableCell>
													</TableRow>
												) : (
													<TableRow
														key={order.id}
														className="hover:bg-gray-100 cursor-pointer"
														onClick={() => {}}
													>
														<TableCell className="font-medium text-black">
															{new Date(order.createdAt).toLocaleString()}
														</TableCell>
														<TableCell className="text-right hover:bg-gray-100 text-black">
															{order.status}
														</TableCell>
														<TableCell className="hover:bg-gray-100 font-semibold text-black">
															{(order.price / 100).toFixed(2).replace('.', ',')}
															€
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</div>
								<div className="flex w-full justify-end">
									<Button onClick={handleLogout} variant="destructive">
										Log out
									</Button>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		);
	}
);

ProfileModal.displayName = 'ProfileModal';

export default ProfileModal;
