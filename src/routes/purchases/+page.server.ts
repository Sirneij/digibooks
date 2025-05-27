import { db } from '$lib/server/db';
import { purchases, books } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const email = url.searchParams.get('email');

	if (!email) {
		return {
			purchases: [],
			email: null
		};
	}

	try {
		// Fetch purchases with book details for the given email
		const userPurchases = await db
			.select({
				id: purchases.id,
				quantity: purchases.quantity,
				customerEmail: purchases.customerEmail,
				purchasedAt: purchases.purchasedAt,
				stripeCheckoutSessionId: purchases.stripeCheckoutSessionId,
				isCompleted: purchases.isCompleted,
				book: {
					id: books.id,
					title: books.title,
					author: books.author,
					description: books.description,
					coverImageUrl: books.coverImageUrl,
					priceInCents: books.priceInCents
				}
			})
			.from(purchases)
			.innerJoin(books, eq(purchases.bookId, books.id))
			.where(and(eq(purchases.customerEmail, email), eq(purchases.isCompleted, true)))
			.orderBy(desc(purchases.purchasedAt));
		return {
			purchases: userPurchases,
			email
		};
	} catch (error) {
		console.error('Failed to fetch purchases:', error);
		return {
			purchases: [],
			email,
			error: 'Failed to load purchases'
		};
	}
};
