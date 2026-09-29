import type { RequestHandler } from 'express';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateId: RequestHandler<{ id: string }> = (req, res, next) => {
	if (!UUID_REGEX.test(req.params.id)) {
		return res.status(400).json({ error: 'Invalid note id' });
	}

	next();
};
