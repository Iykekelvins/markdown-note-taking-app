import { Pool } from 'pg';
import { DATABASE_URL } from '../config.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
	connectionString: DATABASE_URL,
});

export async function checkDBConnection() {
	try {
		const { rows } = await pool.query(`SELECT NOW()`);
		console.log('DB connection successful', rows[0]);
	} catch (error) {
		console.error('Failed to connect to DB', error);
		process.exit(1);
	}
}

export const db = drizzle({
	client: pool,
	casing: 'snake_case',
});
