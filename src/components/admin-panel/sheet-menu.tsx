import Link from 'next/link'
import Image from 'next/image'
import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Menu } from '@/components/admin-panel/menu'
import {
	Sheet,
	SheetHeader,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'

export function SheetMenu() {
	return (
		<Sheet>
			<SheetTrigger className="lg:hidden" asChild>
				<Button className="h-8" variant="outline" size="icon">
					<MenuIcon size={20} />
				</Button>
			</SheetTrigger>
			<SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
				<SheetHeader>
					<Button
						className="flex justify-center items-center pb-2 pt-1"
						variant="link"
						asChild
					>
						<Link href="/" className="flex items-center">
							<Image
								className="h-10"
								width={396}
								height={100}
								src="/pulsar_text_logo.svg"
								alt="pulsar digital"
							/>
						</Link>
					</Button>
				</SheetHeader>
				<Menu isOpen />
			</SheetContent>
		</Sheet>
	)
}
