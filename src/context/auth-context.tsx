import { useQuery } from '@tanstack/react-query'
import {
	PropsWithChildren,
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { usePathname, useRouter } from 'next/navigation'
import client, { UserInterface, UserRole } from '@/client/client'

export type AuthContextType = {
	user?: UserInterface
	token: string
	isGuest: () => boolean
	login: (username: string, password: string) => Promise<void>
	register: (username: string, email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<UserInterface>()
	const [token, setToken, removeToken] = useLocalStorage('token', '')
	const router = useRouter()
	const pathname = usePathname()

	const { data: me, isFetching } = useQuery({
		enabled: !!token,
		queryKey: ['self', token],
		queryFn: async () => {
			const res = await client.api.users.self.$get(
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			return (await res.json()).user
		},
		retry: false,
	})

	useEffect(() => {
		// Only run this effect after the query is done loading.
		if (!isFetching) {
			console.log('stopped fetching', me)
			// If there's no token or no user (me) returned, redirect to login.
			if (
				(!token ||
					!me ||
					(me?.role !== UserRole.owner && me?.role !== UserRole.admin)) &&
				!['/auth/login', '/auth/register'].includes(pathname)
			) {
				router.push('/auth/login')
			} else if (me && me.id !== user?.id) {
				setUser(me)
			}
		}
	}, [isFetching, token, me, user, router, pathname])

	const isGuest = useCallback(() => user?.role === UserRole.guest, [user])

	const login = useCallback(
		async (identifier: string, password: string) => {
			const res = await client.api.auth.login.$post({
				form: { identifier, plainPassword: password },
			})

			const resData = await res.json()

			if (!resData.token) {
				throw new Error(resData.message)
			}

			setToken(resData.token)
		},
		[setToken]
	)

	const register = useCallback(
		async (username: string, email: string, password: string) => {
			const res = await client.api.auth.register.$post({
				form: { username, email, plainPassword: password },
			})

			setToken((await res.json()).token)
		},
		[setToken]
	)

	const logout = useCallback(async () => {
		removeToken()
		setUser(undefined)
		router.push('/')
	}, [removeToken, router])

	const value = useMemo(
		() => ({
			user,
			token,
			isGuest,
			login,
			register,
			logout,
		}),
		[user, token, isGuest, login, register, logout]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
