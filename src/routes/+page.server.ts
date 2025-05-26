import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const allBooks = await db.select().from(books);
		return {
			books: allBooks.length > 0 ? allBooks : basicBooks
		};
	} catch (error) {
		console.error('Error fetching books:', error);
		return {
			books: [],
			error: 'Could not load books.'
		};
	}
};
const basicBooks = [
	{
		id: 1,
		title: 'SvelteKit for Beginners',
		author: 'Jane Doe',
		priceInCents: 2999,
		coverImageUrl: 'https://placehold.co/300x450/007acc/white?text=SvelteKit',
		description: 'A comprehensive guide to SvelteKit.'
	},
	{
		id: 2,
		title: 'Mastering Tailwind CSS',
		author: 'John Smith',
		priceInCents: 2499,
		coverImageUrl: 'https://placehold.co/300x450/38bdf8/white?text=Tailwind',
		description: 'Learn Tailwind CSS from scratch.'
	},
	{
		id: 3,
		title: 'Stripe Integration Made Easy',
		author: 'Alice Brown',
		priceInCents: 3499,
		coverImageUrl: 'https://placehold.co/300x450/635bff/white?text=Stripe',
		description: 'Integrate Stripe payments seamlessly.'
	}
];
