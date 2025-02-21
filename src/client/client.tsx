// TODO: fix this export to be from server only not from src/app

import type { AppType } from '../../../server/src/app'
import { hc } from 'hono/client'

import { UserInterface } from '../../../server/src/db/models/User'
import { UserRole } from '../../../server/src/db/types'
import { CategoryInterface } from '../../../server/src/db/models/Category'
import { ProductInterface } from '../../../server/src/db/models/Product'
import {
	CategoryModifiable,
	categoryModifiableSchema,
} from '../../../server/src/types/category'
import {
	ProductModifiable,
	productModifiableSchema,
} from '../../../server/src/types/product'

const client = hc<AppType>('http://192.168.0.236:7071/')

export {
	type UserInterface,
	type CategoryInterface,
	type ProductInterface,
	categoryModifiableSchema,
	type CategoryModifiable,
	productModifiableSchema,
	type ProductModifiable,
	type ImageBaseInterface,
	UserRole,
}
export default client
