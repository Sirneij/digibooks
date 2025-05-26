import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	author: text('author').notNull(),
	description: text('description'),
	coverImageUrl: text('cover_image_url'),
	// Store price in cents to avoid floating point issues
	priceInCents: integer('price_in_cents').notNull()
});

export const purchases = sqliteTable('purchases', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	quantity: integer('quantity').notNull().default(1),
	customerEmail: text('customer_email').notNull(),
	bookId: integer('book_id')
		.notNull()
		.references(() => books.id, { onDelete: 'cascade' }), // Optional: onDelete behavior
	purchasedAt: integer('purchased_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	stripeCheckoutSessionId: text('stripe_checkout_session_id').notNull().unique()
});

export type Book = typeof books.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type BookInsert = typeof books.$inferInsert;
export type PurchaseInsert = typeof purchases.$inferInsert;
