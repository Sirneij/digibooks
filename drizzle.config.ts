import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!process.env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: process.env.DATABASE_URL?.startsWith('file:') ? 'sqlite' : 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	},
	verbose: true,
	strict: true
});
