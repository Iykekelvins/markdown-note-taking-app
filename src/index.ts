import express, { type ErrorRequestHandler } from 'express';
import { PORT } from './config.ts';
import { checkDBConnection } from './db/index.ts';
import multer from 'multer';
import path from 'node:path';
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

app.post('/notes', upload.single('file'), (req, res) => {
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

	if (file.size === 0) {
		return res.status(400).json({
			error: 'File is empty',
		});
	}
	res.json({
		originalName: file.originalname,
		mimetype: file.mimetype,
		size: file.size,
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
