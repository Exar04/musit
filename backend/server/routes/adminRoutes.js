import { Router } from 'express';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { createSong, deleteSong } from '../controllers/adminController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Admin route is working' })
})

router.post("/song/create", protect, requireAdmin, upload.fields([{ name: "image", maxCount: 1 },{ name: "song", maxCount: 1 }]), createSong)
router.delete("/song/:id", protect, requireAdmin, deleteSong)


export default router;