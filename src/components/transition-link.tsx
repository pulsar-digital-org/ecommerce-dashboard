import { usePageTransition } from '@/hooks/use-transition'
import Link from 'next/link'

interface TransitionLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	to: string
	children: React.ReactNode
}

export function TransitionLink({
	to,
	children,
	onClick,
	...props
}: TransitionLinkProps) {
	const { startTransition } = usePageTransition()

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()

		if (onClick) onClick(e)

		if (to === window.location.pathname) {
			startTransition('/')
			return
		}
		startTransition(to)
	}

	return (
		<Link href={to} onClick={handleClick} {...props}>
			{children}
		</Link>
	)
}
