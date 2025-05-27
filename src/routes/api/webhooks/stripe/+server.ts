import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { stripe } from '$lib/server/payments';
import type { SessionMetadata } from '$lib/types/cart.js';
import { error, json } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';

export async function POST({ request }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		error(400, 'Missing stripe-signature header');
	}

	try {
		const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			const metadata = session.metadata as unknown as SessionMetadata;

			if (!metadata.bookIds || !metadata.timestamp) {
				error(400, 'Missing required metadata');
			}

			const bookIds = metadata.bookIds.split(',').map((id) => Number(id.trim()));

			// Update the purchase record in the database by setting `isCompleted` to true
			// for purchases that match the book IDs and sessionid
			await db
				.update(purchases)
				.set({ isCompleted: true })
				.where(
					and(inArray(purchases.bookId, bookIds), eq(purchases.stripeCheckoutSessionId, session.id))
				);
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		error(400, 'Webhook Error');
	}
}
