import { ContentLayout } from '@/components/admin-panel/content-layout'
import ProductPreview from '@/components/product_page/product_preview'
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

type PageParams = {
	params: Promise<{
		id: string
	}>
}

const Page = async ({ params }: PageParams) => {
	const { id } = await params

	console.log(id)

	return (
		<ContentLayout title="Nicolas Panco">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/products">Products</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{id}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<ProductPreview productId={id} />
		</ContentLayout>
	)
}

export default Page
