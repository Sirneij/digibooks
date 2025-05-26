import { browser } from '$app/environment';
import type { Book } from '$lib/server/db/schema';
import type { CartItem } from '$lib/types/cart';
import { formatMoney } from '$lib/utils/helpers';

// Load cart from localStorage if available
function loadCartFromStorage(): CartItem[] {
	if (!browser) return [];
	try {
		const saved = localStorage.getItem('digibooks-cart');
		return saved ? JSON.parse(saved) : [];
	} catch {
		return [];
	}
}

// Save cart to localStorage
function saveCartToStorage(cart: CartItem[]): void {
	if (!browser) return;
	try {
		localStorage.setItem('digibooks-cart', JSON.stringify(cart));
	} catch (error) {
		console.error('Failed to save cart to localStorage:', error);
	}
}

// Cart state management using Svelte 5 runes
function createCartState() {
	let items = $state<CartItem[]>(loadCartFromStorage());

	function addItem(book: Book) {
		const existingItem = items.find((item) => item.book.id === book.id);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			items.push({ book, quantity: 1 });
		}

		saveCartToStorage(items);
	}

	function removeItem(bookId: number) {
		items = items.filter((item) => item.book.id !== bookId);
		saveCartToStorage(items);
	}

	function updateQuantity(bookId: number, quantity: number) {
		if (quantity <= 0) {
			removeItem(bookId);
			return;
		}

		const item = items.find((item) => item.book.id === bookId);
		if (item) {
			item.quantity = quantity;
			saveCartToStorage(items);
		}
	}
	function clear() {
		items = [];
		saveCartToStorage(items);
	}

	function getTotalItems(): number {
		return items.reduce((total, item) => total + item.quantity, 0);
	}

	function getTotalPrice(): number {
		return items.reduce((total, item) => total + item.book.priceInCents * item.quantity, 0);
	}

	function getFormattedTotal(): string {
		return formatMoney(getTotalPrice());
	}

	return {
		get items() {
			return items;
		},
		addItem,
		removeItem,
		updateQuantity,
		clear,
		getTotalItems,
		getTotalPrice,
		getFormattedTotal
	};
}

// Create a singleton instance
export const cartState = createCartState();
