import eventsManager from '../../events/eventsManager';
import House from './model';
import Lock from '../lock/model';

export default {
  houses_get_all: (req, res) => {
    const houses = House.all();
    res.status(200).json(
      houses.map(({ id, name, locks }) => ({
        id,
        name,
        numLocks: locks.length,
      }))
    );
  },
  houses_get: (req, res) => {
    const houseId = parseInt(req.params.houseId);
    const house = House.get(houseId);

    if (!house) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json((({ id, name }) => ({ id, name }))(house));
  },
  houses_get_locks: (req, res) => {
    const houseId = parseInt(req.params.houseId);
    const house = House.get(houseId);

    if (!house) {
      res.sendStatus(404);
      return;
    }

    const locks = house.locks;
    res.status(200).json(
      locks.map(({ id, category, name, status }) => ({
        id,
        category,
        name,
        status,
      }))
    );
  },
  houses_get_lock: (req, res) => {
    const houseId = parseInt(req.params.houseId);
    const lockId = parseInt(req.params.lockId);
    const house = House.get(houseId);

    if (!house) {
      res.sendStatus(404);
      return;
    }

    const lock = house.getLock(lockId);

    if (!lock) {
      res.sendStatus(404);
      return;
    }

    res
      .status(200)
      .json(
        (({ id, category, name, status }) => ({ id, category, name, status }))(
          lock
        )
      );
  },
  houses_update_lock: async (req, res) => {
    const houseId = parseInt(req.params.houseId);
    const lockId = parseInt(req.params.lockId);
    const house = House.get(houseId);

    if (!house) {
      res.sendStatus(404);
      return;
    }

    const lock = house.getLock(lockId);

    if (!lock) {
      res.sendStatus(404);
      return;
    }

    if (lock.isOffline()) {
      res.sendStatus(503);
      return;
    }

    if (!Lock.validStatusValues.includes(req.body.status)) {
      res.sendStatus(400);
      return;
    }

    const lockStatus = await lock.setStatus(req.body.status);
    if (!lockStatus.ok) {
      eventsManager.emit('error', lockStatus.data.error);
      if (lockStatus.data.error === 'Not Found') {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(500);
      return;
    }

    const io = req.app.get('io');
    io.emit(`/lock/status`, lock);
    res.status(200).json(lock);
  },
};
