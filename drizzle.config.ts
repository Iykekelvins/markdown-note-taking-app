import { defineConfig } from 'drizzle-kit';

process.loadEnvFile();
const url = process.env.DATABASE_URL;
if (!url) throw new Error('Missing DATABASE_URL');

export default defineConfig({
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/db/schema.ts',
	casing: 'snake_case',
	dbCredentials: { url },
});
