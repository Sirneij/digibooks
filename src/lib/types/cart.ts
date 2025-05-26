import type { Book } from '$lib/server/db/schema';

// Cart item interface
export interface CartItem {
	book: Book;
	quantity: number;
}
