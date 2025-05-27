import type { Book } from '$lib/server/db/schema';

// Cart item interface
export interface CartItem {
	book: Book;
	quantity: number;
}

export interface SessionMetadata {
	customerEmail?: string;
	userId?: string; // Optional user ID for authenticated users
	timestamp: string; // ISO string for when the session was created
	bookIds: string; // Comma-separated list of book IDs in the cart
	itemCount?: string; // Number of items in the cart
	totalAmount?: string; // Total amount in cents as a string
}
