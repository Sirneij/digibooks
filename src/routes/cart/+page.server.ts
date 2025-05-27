import { createCheckoutSession } from '$lib/server/payments';
import type { CartItem } from '$lib/types/cart';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	checkout: async ({ request, url }) => {
		const formData = await request.formData();
		const cartItems = JSON.parse(formData.get('cartItems') as string) as CartItem[];
		const customerEmail = formData.get('email') as string;

		// Validate cart items
		if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
			return fail(400, {
				error: 'Cart is empty'
			});
		}

		const result = await createCheckoutSession({
			items: cartItems,
			customerEmail: customerEmail || undefined,
			metadata: {
				userId: 'guest', // Replace with actual user ID if authenticated
				timestamp: new Date().toISOString(),
				books: JSON.stringify(
					cartItems.map((item) => ({
						bookId: item.book.id.toString(),
						quantity: item.quantity
					}))
				),
				itemCount: cartItems.reduce((total, item) => total + item.quantity, 0).toString(),
				totalAmount: cartItems
					.reduce((total, item) => total + item.book.priceInCents * item.quantity, 0)
					.toString()
			},
			successUrl: `${url.origin}/cart?checkout=success`,
			cancelUrl: `${url.origin}/cart?checkout=cancel`
		});

		if (!result.success) {
			return fail(500, {
				error: result.error || 'Failed to create checkout session'
			});
		}

		// Redirect to Stripe checkout
		redirect(303, result.url!);
	}
};
