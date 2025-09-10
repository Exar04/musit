import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { trace } from "@opentelemetry/api"

const router = Router();
const tracer = trace.getTracer('authRoute', '1.0')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Auth route is working' });
})

export default router;