import { Router } from 'express';
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from '../controllers/songController.js';

const router = Router();

router.get('/', getAllSongs)
router.get('/featured', getFeaturedSongs)
router.get('/made-for-you', getMadeForYouSongs)
router.get('/trending', getTrendingSongs)


router.get('/test', (req, res) => {
    res.status(200).json({ message: 'song route is working' });
})

export default router;