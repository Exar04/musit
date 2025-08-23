import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllUsers } from '../controllers/userController.js';

const router = Router();

router.get('/', protect, getAllUsers)

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'user route is working' });
})

export default router;