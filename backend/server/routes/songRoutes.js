import { Router } from 'express';
// import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

router.get('/', (req, res) => {
    res.status(200).json({ message: 'song route is working' });
})

export default router;