import express from 'express';
import { PORT } from './config.ts';
import { checkDBConnection } from './db/index.ts';
const app = express();

app.get('/health', (_req, res) => {
	res.json({
		status: 'OK',
	});
});

await checkDBConnection();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
