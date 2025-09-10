import { Router } from 'express';
import { test, testLateResponse } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';
import { trace } from "@opentelemetry/api"

const router = Router();
const tracer = trace.getTracer('testRoute', '1.0')

router.get('/', protect, test);
router.get('/latency', testLateResponse);

export default router;