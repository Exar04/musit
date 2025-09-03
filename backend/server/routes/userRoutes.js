import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllUsers, getMessages } from '../controllers/userController.js';

const router = Router();

router.get('/getAllUsers', protect, getAllUsers)
router.get('/messages/:userId', protect, getMessages)

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'user route is working' });
})

export default router;