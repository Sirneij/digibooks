import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const allBooks = await db.select().from(books);
		return {
			books: allBooks
		};
	} catch (error) {
		console.error('Error fetching books:', error);
		return {
			books: [],
			error: 'Could not load books.'
		};
	}
};
