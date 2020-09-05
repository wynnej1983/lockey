import express from 'express';
import HouseController from './index';

const router = express.Router();

router.get('/', HouseController.houses_get_all);

router.get('/:houseId', HouseController.houses_get);

router.get('/:houseId/locks', HouseController.houses_get_locks);

router.get('/:houseId/locks/:lockId', HouseController.houses_get_lock);

router.patch(
  '/:houseId/locks/:lockId/locking',
  HouseController.houses_update_lock
);

export default router;
