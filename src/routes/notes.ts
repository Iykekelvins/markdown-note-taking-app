import { Router } from 'express';
import { extractTitle } from '../utils/extractTitle.ts';
import { notes } from '../db/schema.ts';
import { upload } from '../middleware/upload.ts';
import { db } from '../db/index.ts';

import path from 'node:path';

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
		.insert(notes)
		.values({
			title,
			content,
		})
		.returning();

	res.status(201).json({
		note,
	});
});

export default router;
