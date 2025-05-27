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
	books: string; // Array of book IDs and their quantities
	itemCount?: string; // Number of items in the cart
	totalAmount?: string; // Total amount in cents as a string
}

export interface PaginationMetadata {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
