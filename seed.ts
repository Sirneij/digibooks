import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
config();

// Load books data from JSON file
const booksJsonPath = resolve(process.cwd(), 'books.json');
const booksData = JSON.parse(readFileSync(booksJsonPath, 'utf8'));

async function seedDatabase() {
	try {
		console.log('🌱 Starting database seeding...');

		// Check if environment variables are set
		if (!process.env.DATABASE_URL) {
			throw new Error('DATABASE_URL is not set');
		}

		// Check if auth token is needed (only for remote databases)
		const isLocalFile = process.env.DATABASE_URL.startsWith('file:');
		if (!isLocalFile && !process.env.DATABASE_AUTH_TOKEN) {
			throw new Error('DATABASE_AUTH_TOKEN is required for remote databases');
		}

		// Create database client
		const client = createClient({
			url: process.env.DATABASE_URL,
			authToken: isLocalFile ? undefined : process.env.DATABASE_AUTH_TOKEN
		});

		console.log(`📚 Processing ${booksData.length} books from books.json...`);

		let insertedCount = 0;
		let updatedCount = 0;

		// Process each book individually using UPSERT (INSERT OR REPLACE)
		for (const bookData of booksData) {
			try {
				// Use UPSERT to insert or update based on title
				// SQLite doesn't have ON CONFLICT with RETURNING, so we'll check first
				const existingBook = await client.execute({
					sql: 'SELECT id FROM books WHERE title = ? LIMIT 1',
					args: [bookData.title]
				});

				if (existingBook.rows.length > 0) {
					// Update existing book
					await client.execute({
						sql: `UPDATE books 
                              SET author = ?, 
                                  description = ?, 
                                  cover_image_url = ?, 
                                  price_in_cents = ?
                              WHERE title = ?`,
						args: [
							bookData.author,
							bookData.description,
							bookData.cover_image_url,
							bookData.price_in_cents,
							bookData.title
						]
					});
					console.log(`🔄 Updated "${bookData.title}" by ${bookData.author}`);
					updatedCount++;
				} else {
					// Insert new book
					await client.execute({
						sql: `INSERT INTO books (title, author, description, cover_image_url, price_in_cents) 
                              VALUES (?, ?, ?, ?, ?)`,
						args: [
							bookData.title,
							bookData.author,
							bookData.description,
							bookData.cover_image_url,
							bookData.price_in_cents
						]
					});
					console.log(`✅ Inserted "${bookData.title}" by ${bookData.author}`);
					insertedCount++;
				}
			} catch (error) {
				console.error(`❌ Failed to process "${bookData.title}":`, error);
			}
		}

		console.log(`\n📊 Seeding Summary:`);
		console.log(`   • Books inserted: ${insertedCount}`);
		console.log(`   • Books updated: ${updatedCount}`);
		console.log(`   • Total processed: ${booksData.length}`);

		// Verify the total count in database
		const totalBooks = await client.execute({
			sql: 'SELECT COUNT(*) as count FROM books'
		});
		const count = totalBooks.rows[0].count;
		console.log(`   • Total books in database: ${count}`);

		// Close the connection
		client.close();
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
}

// Run the seeding
seedDatabase()
	.then(() => {
		console.log('\n🎉 Seeding completed successfully!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('💥 Seeding failed with error:', error);
		process.exit(1);
	});
