import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
	id: uuid().primaryKey().defaultRandom(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
