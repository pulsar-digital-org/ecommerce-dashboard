import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import React, { PropsWithChildren } from 'react'
import { ProvidersUnathorized } from './providers-unathorized'

const roboto = Ubuntu({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Pulsar Dashboard',
	description: 'Pulsar dash',
}

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body
				className={`${roboto.className} antialiased flex flex-col overflow-hidden h-dvh w-svh relative`}
			>
				<ProvidersUnathorized>{children}</ProvidersUnathorized>
			</body>
		</html>
	)
}
