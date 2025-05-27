import { STRIPE_SECRET_KEY } from '$env/static/private';
import type { CartItem, SessionMetadata } from '$lib/types/cart';
import Stripe from 'stripe';
import { db } from './db';
import { purchases } from './db/schema';

export const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createCheckoutSession({
	items,
	successUrl,
	cancelUrl,
	customerEmail,
	metadata
}: {
	items: CartItem[];
	successUrl: string;
	cancelUrl: string;
	customerEmail?: string;
	metadata?: SessionMetadata;
}) {
	try {
		// Convert items to Stripe line items
		const lineItems = items.map((item) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.book.title,
					description: item.book.description || undefined,
					images: item.book.coverImageUrl ? [item.book.coverImageUrl] : undefined,
					metadata: {
						bookId: item.book.id
					}
				},
				unit_amount: item.book.priceInCents
			},
			quantity: item.quantity
		}));
		const sessionParams: Stripe.Checkout.SessionCreateParams = {
			line_items: lineItems,
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
			billing_address_collection: 'required',
			payment_intent_data: {
				metadata: {
					...metadata,
					source: 'digibooks'
				}
			},
			metadata: {
				...metadata
			}
		};

		// Add customer email if provided
		if (customerEmail) {
			sessionParams.customer_email = customerEmail;
		}

		const session = await stripe.checkout.sessions.create(sessionParams);

		// Create individual purchase records for each book
		const purchaseRecords = items.map((item) => ({
			quantity: item.quantity,
			customerEmail: customerEmail || 'guest',
			bookId: item.book.id,
			purchasedAt: new Date(),
			stripeCheckoutSessionId: session.id
		}));

		// Insert all purchase records
		await db.insert(purchases).values(purchaseRecords);

		return {
			success: true,
			sessionId: session.id,
			url: session.url
		};
	} catch (error) {
		console.error('Stripe checkout session creation failed:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create checkout session'
		};
	}
}
