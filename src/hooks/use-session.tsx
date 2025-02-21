import { AuthContext, AuthContextType } from '@/context/auth-context'
import { useContext } from 'react'

export const useSession = () => {
	const context = useContext(AuthContext)

	if (context === null) {
		throw new Error('useSession must be used within an AuthProvider')
	}

	if (context.user === null) {
		throw new Error('useSession must be used with a logged in user')
	}

	return context as Required<AuthContextType>
}
