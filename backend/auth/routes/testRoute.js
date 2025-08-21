import { Router } from 'express';
import { test } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, test);

export default router;