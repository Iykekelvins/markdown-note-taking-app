import type { ErrorRequestHandler } from 'express';
import multer from 'multer';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
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
