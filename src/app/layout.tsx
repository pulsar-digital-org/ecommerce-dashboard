import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import React, { PropsWithChildren } from 'react'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Pulsar Dashboard',
	description: 'Pulsar dash',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body
				className={`${montserrat.className} antialiased flex flex-col overflow-hidden h-dvh w-svh relative`}
			>
				<Providers>{children} </Providers>
			</body>
		</html>
	)
}
