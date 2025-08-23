import { Router } from 'express';
import { getAlbumsById, getAllAlbums } from '../controllers/albumController.js';

const router = Router();

router.get('/', getAllAlbums)
router.get('/:albumId', getAlbumsById)

export default router;