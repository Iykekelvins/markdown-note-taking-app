import express from 'express';
import { PORT } from './config.ts';
import { checkDBConnection } from './db/index.ts';
import notesRouter from './routes/notes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();

app.get('/health', (_req, res) => {
	res.json({
		status: 'OK',
	});
});

app.use('/notes', notesRouter);

app.use(errorHandler);

await checkDBConnection();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
