import express from 'express';
import { PORT } from './config.ts';
const app = express();

app.get('/health', (_req, res) => {
	res.json({
		status: 'OK',
	});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
