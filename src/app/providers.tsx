'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { type PropsWithChildren } from 'react'

import { TransitionProvider } from '@/context/transition-context'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import { AuthProvider } from '@/context/auth-context'

const queryClient = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => (
	<QueryClientProvider client={queryClient}>
		<TransitionProvider>
			<AuthProvider>
				<AdminPanelLayout>{children}</AdminPanelLayout>
			</AuthProvider>
		</TransitionProvider>
	</QueryClientProvider>
)
