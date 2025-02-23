'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'

const ThemeProviderSSR = ({ children }: { children: React.ReactNode }) => {
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		setLoaded(true)
	}, [setLoaded])

	if (!loaded) {
		return <>{children}</>
	}

	return (
		<ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
			{children}
		</ThemeProvider>
	)
}

export default ThemeProviderSSR
