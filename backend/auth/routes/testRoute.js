import { Router } from 'express';
import { test, testLateResponse } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, test);
router.get('/latency', testLateResponse);

export default router;