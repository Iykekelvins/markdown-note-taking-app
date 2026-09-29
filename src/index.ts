import express, { type ErrorRequestHandler } from 'express';
import { PORT } from './config.ts';
import { checkDBConnection, db } from './db/index.ts';
import multer from 'multer';
import path from 'node:path';
import { extractTitle } from './utils/extractTitle.ts';
import { notes } from './db/schema.ts';

const app = express();

app.get('/health', (_req, res) => {
	res.json({
		status: 'OK',
	});
});

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 1024 * 1024 },
});
const ALLOWED_EXTENSIONS = ['.md', '.markdown'];

app.post('/notes', upload.single('file'), async (req, res) => {
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

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(413).json({
				error: 'File too large (max 1MB)',
			});
		}
		return res.status(400).json({
			error: err.message,
		});
	}
	console.error(err);

	res.status(500).json({
		error: 'Internal server error',
	});
};

app.use(errorHandler);

await checkDBConnection();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
