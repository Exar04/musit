import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, requireAdmin, getStats)

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'stats route is working' });
})

export default router;