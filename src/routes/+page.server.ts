import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { or, and, type SQL, like, asc, desc, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('search');
	const sortBy = url.searchParams.get('sort') || 'featured';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 8;
	const offset = (page - 1) * limit;

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

	// Execute both queries in parallel
	const [countResult, allBooks] = await Promise.all([
		// Count query
		db
			.select({ count: count() })
			.from(books)
			.where(whereClause.length > 0 ? or(...whereClause) : undefined)
			.then((result) => result[0]),

		// Books query with pagination
		db
			.select()
			.from(books)
			.where(whereClause.length > 0 ? or(...whereClause) : undefined)
			.orderBy(...orderByClause)
			.limit(limit)
			.offset(offset)
	]);

	return {
		books: allBooks || [],
		pagination: {
			total: countResult.count,
			page,
			limit,
			totalPages: Math.ceil(countResult.count / limit)
		},
		searchQuery,
		sortBy
	};
};
