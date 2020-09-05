import Lock from './model';

export default {
  locks_get_all: (req, res) => {
    const locks = Lock.all();
    res.status(200).json(
      locks.map(({ id, category, name, status }) => ({
        id,
        category,
        name,
        status,
      }))
    );
  },

  locks_get_favorites: (req, res) => {
    const user = req.user;
    const locks = Lock.all();

    res.status(200).json(
      locks
        .filter((lock) => user.favorites.has(lock.id))
        .map(({ id, houseId, category, name, status }) => ({
          id,
          houseId,
          category,
          name,
          status,
        }))
    );
  },

  locks_add_favorite: (req, res) => {
    const lockId = parseInt(req.params.lockId);
    const user = req.user;
    const lock = Lock.get(lockId);

    if (!lock) {
      res.sendStatus(400);
      return;
    }

    user.addFavorite(lockId);
    res.status(204).end();
  },

  locks_remove_favorite: (req, res) => {
    const lockId = parseInt(req.params.lockId);
    const user = req.user;
    const lock = Lock.get(lockId);

    if (!lock) {
      res.sendStatus(400);
      return;
    }

    user.removeFavorite(lockId);
    res.status(204).end();
  },
};
