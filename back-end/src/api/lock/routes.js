import express from 'express';
import LockController from './index';

const router = express.Router();

router.get('/', LockController.locks_get_all);

router.get('/favorites', LockController.locks_get_favorites);

router.put('/:lockId/favorite', LockController.locks_add_favorite);

router.delete('/:lockId/favorite', LockController.locks_remove_favorite);

export default router;
