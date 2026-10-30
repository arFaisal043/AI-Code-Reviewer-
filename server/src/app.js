import 'dotenv/config';
import express from 'express';
import { getReviewRoutes } from './routes/ai.routes.js';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.use('/ai', getReviewRoutes);