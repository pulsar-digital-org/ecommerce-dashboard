'use client'

import { LoginForm } from '@/components/login-form'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

export default function LoginPage() {
	const [show, setShow] = useState(true)

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
					initial={{ opacity: 0, scale: 0.9, filter: 'blur(3px)' }}
					exit={{ opacity: 0, scale: 0.9, filter: 'blur(3px)' }}
					transition={{
						duration: 0.6,
						ease: [0.1, 0.4, 0.5, 1],
					}}
					className="flex h-[100svh] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
				>
					<div className="w-full max-w-sm">
						<LoginForm />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
