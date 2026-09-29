import { Router } from 'express';
import { extractTitle } from '../utils/extractTitle.ts';
import { notes as notesTable } from '../db/schema.ts';
import { upload } from '../middleware/upload.ts';
import { db } from '../db/index.ts';
import { desc, eq } from 'drizzle-orm';
import { marked } from 'marked';

import path from 'node:path';
import { validateId } from '../middleware/validateId.ts';

const ALLOWED_EXTENSIONS = ['.md', '.markdown'];

const router = Router();

router.post('/', upload.single('file'), async (req, res) => {
	const file = req.file;
	if (!file) {
		return res.status(400).json({
			error: 'No file uploaded',
		});
	}

	const ext = path.extname(file.originalname).toLowerCase();
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		return res.status(400).json({
			error: 'Invalid file type',
		});
	}

	const content = file.buffer.toString('utf-8');
	if (content.trim() === '') {
		return res.status(400).json({ error: 'File is empty' });
	}

	const title = extractTitle(content);
	const [note] = await db
		.insert(notesTable)
		.values({
			title,
			content,
		})
		.returning();

	res.status(201).json({
		note,
	});
});

router.get('/', async (_req, res) => {
	const notes = await db
		.select({
			id: notesTable.id,
			title: notesTable.title,
			createdAt: notesTable.createdAt,
		})
		.from(notesTable)
		.orderBy(desc(notesTable.createdAt));

	res.json({
		notes,
	});
});

router.get('/:id/html', validateId, async (req, res) => {
	const noteId = req.params.id;
	const [note] = await db.select().from(notesTable).where(eq(notesTable.id, noteId));
	if (!note) {
		return res.status(404).json({
			error: 'Note not found',
		});
	}

	const html = await marked.parse(note.content);
	res.send(html);
});

export default router;
