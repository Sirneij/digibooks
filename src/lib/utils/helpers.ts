import { goto } from '$app/navigation';
import type { Book } from '$lib/server/db/schema';
import { cartState } from '$lib/states/carts.svelte';

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
	cartState.addItem(book);
};

export function calculateVisiblePages(currentPage: number, total: number) {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

	if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', total];
	if (currentPage >= total - 3)
		return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

	return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total];
}

export async function handlePageChange(newPage: number) {
	const url = new URL(window.location.href);
	const params = url.searchParams;

	// Update the page parameter
	params.set('page', newPage.toString());

	// Use replace to prevent history stack buildup
	goto(`?${params.toString()}`, {
		replaceState: true,
		keepFocus: true
	});
}
