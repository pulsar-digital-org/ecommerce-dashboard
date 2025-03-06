'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { type PropsWithChildren } from 'react'
import { Theme } from '@radix-ui/themes'
import { Toaster } from '@/components/ui/sonner'
import { TransitionProvider } from '@/context/transition-context'
import { AuthProvider } from '@/context/auth-context'
import { ThemeProvider } from '@/components/providers/theme-provider'

const queryClient = new QueryClient()

export const ProvidersUnathorized = ({ children }: PropsWithChildren) => (
	<QueryClientProvider client={queryClient}>
		<TransitionProvider>
			<Theme>
				<ThemeProvider>
					<AuthProvider>
						<Toaster />
						{children}
					</AuthProvider>
				</ThemeProvider>
			</Theme>
		</TransitionProvider>
	</QueryClientProvider>
)
