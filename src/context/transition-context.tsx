'use client'

import React, {
	createContext,
	useState,
	useCallback,
	useContext,
	ReactNode,
	useMemo,
	useEffect,
	useRef,
} from 'react'
import { useRouter } from 'next/navigation'

type TransitionContextType = {
	startTransition: (url: string | null) => void
	addTransition: (transitionFn: () => Promise<void>) => void
	removeTransition: (transitionFn: () => Promise<void>) => void
	addBackTransition: (transitionFn: () => Promise<void>) => void
	removeBackTransition: (transitionFn: () => Promise<void>) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(
	undefined
)

export function TransitionProvider({ children }: { children: ReactNode }) {
	const router = useRouter()
	const historyIndex = useRef<number>(0)

	const [transitions, setTransitions] = useState<Array<() => Promise<void>>>([])
	const [backTransitions, setBackTransitions] = useState<
		Array<() => Promise<void>>
	>([])
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

	const completeTransition = useCallback(
		(url: string | null) => {
			if (url) {
				router.push(url)
			} else {
				router.back()
			}
			setIsTransitioning(false)
		},
		[router]
	)

	useEffect(() => {
		window.history.pushState = new Proxy(window.history.pushState, {
			apply: (
				target,
				thisArg,
				argArray: [
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					data: any,
					unused: string,
					url?: string | URL | null | undefined,
				]
			) => {
				const next_array: [
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					data: any,
					unused: string,
					url?: string | URL | null | undefined,
				] = [...argArray]
				next_array[0] = {
					...next_array[0],
					shallow: true,
					historyIndex: historyIndex.current++,
				}
				target.apply(thisArg, next_array)
				return target.apply(thisArg, argArray)
			},
		})

		// TODO: make this work for forward action
		window.history.replaceState = new Proxy(window.history.replaceState, {
			apply: (
				target,
				thisArg,
				argArray: [
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					data: any,
					unused: string,
					url?: string | URL | null | undefined,
				]
			) => {
				return target.apply(thisArg, argArray)
			},
		})
	}, [])

	const startTransition = useCallback(
		async (url: string | null) => {
			if (isTransitioning) return
			console.log('start transition')

			setIsTransitioning(true)

			await Promise.all(transitions.map((transitionFn) => transitionFn()))

			completeTransition(url)
		},
		[completeTransition, isTransitioning, transitions]
	)

	const startBackTransition = useCallback(async () => {
		if (isTransitioning) return
		console.log('start back transition')

		setIsTransitioning(true)

		await Promise.all(backTransitions.map((transitionFn) => transitionFn()))

		completeTransition(null)
	}, [backTransitions, completeTransition, isTransitioning])

	const startBackTransitionRef = useRef(startBackTransition)

	useEffect(() => {
		startBackTransitionRef.current = startBackTransition
	}, [startBackTransition])

	const addTransition = useCallback((transitionFn: () => Promise<void>) => {
		setTransitions((prev) => [...prev, transitionFn])
	}, [])

	const removeTransition = useCallback((transitionFn: () => Promise<void>) => {
		setTransitions((prev) => prev.filter((fn) => fn != transitionFn))
	}, [])

	const addBackTransition = useCallback((transitionFn: () => Promise<void>) => {
		setBackTransitions((prev) => [...prev, transitionFn])
	}, [])

	const removeBackTransition = useCallback(
		(transitionFn: () => Promise<void>) => {
			setBackTransitions((prev) => prev.filter((fn) => fn != transitionFn))
		},
		[]
	)

	useEffect(() => {
		const handlePopState = (event: PopStateEvent) => {
			if (
				event.state &&
				event.state.shallow &&
				historyIndex.current > event.state.historyIndex
			) {
				historyIndex.current--
				startBackTransitionRef.current()
			}
		}

		window.addEventListener('popstate', handlePopState)

		return () => window.removeEventListener('popstate', handlePopState)
	}, [])

	const value = useMemo(
		() => ({
			addTransition,
			addBackTransition,
			removeTransition,
			startTransition,
			removeBackTransition,
		}),
		[
			addBackTransition,
			addTransition,
			removeTransition,
			startTransition,
			removeBackTransition,
		]
	)

	return (
		<TransitionContext.Provider value={value}>
			{children}
		</TransitionContext.Provider>
	)
}

export function useTransitionContext() {
	const context = useContext(TransitionContext)
	if (context === undefined) {
		throw new Error(
			'useTransitionContext must be used within a TransitionProvider'
		)
	}
	return context
}
