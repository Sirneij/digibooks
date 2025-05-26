import type { Book } from '$lib/server/db/schema';

/**
 * Format a number as currency
 *
 * @param {number | string | null | undefined} amount - Amount to format in cents
 * @returns {string} - Formatted currency string
 */
export const formatMoney = (amount: number | string | null | undefined): string => {
	if (amount === null || amount === undefined || isNaN(Number(amount))) {
		return '$0.00'; // Default to $0.00 if input is invalid
	}
	const validAmount = (Number(amount) || 0) / 100; // Convert cents to dollars
	return validAmount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'narrowSymbol'
	});
};

/**
 * Add a book to the cart
 *
 * @param {Book} book - The book to add to the cart
 */
export const addToCart = (book: Book) => {
	console.log('Adding to cart:', book.title);
};
