import cors from 'cors';
import express from 'express';
import { api } from './routes/api.js';
import { errorHandler, notFound } from './middleware/http.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', api);
app.use(notFound);
app.use(errorHandler);
