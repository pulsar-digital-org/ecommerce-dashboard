import '../globals.css'
import { Providers } from '../providers'
import React, { PropsWithChildren } from 'react'

export default function RootLayout({ children }: PropsWithChildren) {
	return <Providers>{children} </Providers>
}
