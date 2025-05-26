import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { or, type SQL, like, asc, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('search');
	const sortBy = url.searchParams.get('sort') || 'featured';

	const whereClause: SQL[] = [];

	// Apply search filter
	if (searchQuery) {
		whereClause.push(like(books.title, `%${searchQuery}%`), like(books.author, `%${searchQuery}%`));
	}

	const orderByClause: SQL[] = [];

	// Apply sorting
	switch (sortBy) {
		case 'price-low':
			orderByClause.push(asc(books.priceInCents));
			break;
		case 'price-high':
			orderByClause.push(desc(books.priceInCents));
			break;
		case 'title':
			orderByClause.push(asc(books.title));
			break;
		case 'author':
			orderByClause.push(asc(books.author));
			break;
		default: // featured
			orderByClause.push(asc(books.id));
			break;
	}
	const allBooks = await db
		.select()
		.from(books)
		.where(or(...whereClause))
		.orderBy(...orderByClause);

	return {
		books: allBooks || []
	};
};
