import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { stripe } from '$lib/server/payments';
import type { SessionMetadata } from '$lib/types/cart.js';
import { error, json } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export async function POST({ request }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		error(400, 'Missing stripe-signature header');
	}

	try {
		const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

		if (
			event.type === 'checkout.session.completed' ||
			event.type === 'checkout.session.async_payment_succeeded'
		) {
			const session = event.data.object;
			const metadata = session.metadata as unknown as SessionMetadata;

			if (!metadata.books || !metadata.timestamp) {
				error(400, 'Missing required metadata');
			}

			const items = JSON.parse(metadata.books) as Array<{ bookId: string; quantity: number }>;
			const customerEmail = session.customer_details?.email || session.customer_email || 'unknown';

			try {
				const purchaseRecords = [];

				// Check each item individually to avoid duplicates from webhook retries
				for (const item of items) {
					const existingPurchase = await db
						.select()
						.from(purchases)
						.where(
							and(
								eq(purchases.stripeCheckoutSessionId, session.id),
								eq(purchases.bookId, parseInt(item.bookId))
							)
						)
						.limit(1);

					if (existingPurchase.length === 0) {
						purchaseRecords.push({
							quantity: item.quantity,
							customerEmail,
							bookId: parseInt(item.bookId),
							stripeCheckoutSessionId: session.id,
							isCompleted: true
						});
					}
				}

				if (purchaseRecords.length > 0) {
					await db.insert(purchases).values(purchaseRecords);
					console.log(
						`✅ Created ${purchaseRecords.length} new purchase records for session ${session.id}`
					);
				} else {
					console.log(`ℹ️ All purchases already exist for session ${session.id}`);
				}
			} catch (dbError) {
				console.error('Database error creating purchases:', dbError);
				error(500, 'Failed to create purchase records');
			}
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		error(400, 'Webhook Error');
	}
}
