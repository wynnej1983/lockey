import smartLock from '../libraries/smartLock';

export default {
  start: (eventsManager) => {
    eventsManager.on('change-status-required', async (lock, newStatus) => {
      const locking = await smartLock.locking(lock.guid, newStatus);
      if (lock.status !== newStatus)
        eventsManager.emit(
          'lock-changed-status',
          lock,
          locking.ok ? newStatus : lock.status
        );
      eventsManager.emit(
        `change-status-completed.${lock.id}`,
        locking.ok ? newStatus : lock.status,
        !locking.ok ? locking.data : undefined
      );
    });
  },
};
