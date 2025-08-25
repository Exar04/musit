import express, { json } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import songRoutes from './routes/songRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const app = express();

app.use(cors());
app.use(json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/songs', songRoutes);
app.use('/album', albumRoutes);
app.use('/stats', statsRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

export default app;