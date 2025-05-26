import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const book = await db
			.select()
			.from(books)
			.where(eq(books.id, Number(params.id)))
			.get();

		if (!book) {
			error(404, 'Book not found');
		}
		return {
			book
		};
	} catch (e: any) {
		console.error(`Error fetching book with id ${params.id}:`, e);
		if (e.status === 404) throw e; // Re-throw SvelteKit errors
		error(500, 'Could not load book details.');
	}
};
