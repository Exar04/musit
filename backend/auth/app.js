import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoute.js';
import testRoutes from './routes/testRoute.js';

const app = express();

app.use(cors());
app.use(json());

app.use('/auth', authRoutes);
app.use('/test', testRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

export default app;