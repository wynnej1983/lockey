import eventsManager from '../../events/eventsManager';
import House from '../house/model';

export default class Lock {
  constructor({ id, category, name, status, houseId }) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.status = status;
    this.houseId = houseId;
  }

  static validStatusValues = ['locked', 'unlocked'];

  static all = () => {
    return House.all().flatMap((house) =>
      house.locks.map((lock) => ({
        ...lock,
        houseId: house.id,
      }))
    );
  };

  static get = (id) => {
    return this.all().find((lock) => lock.id === id);
  };

  setStatus = async (status) => {
    let result = {
      ok: true,
      data: { newStatus: status },
    };

    if (this.status === status) return result;

    if (!Lock.validStatusValues.includes(status)) {
      result = {
        ok: false,
        data: { error: 'Invalid value' },
      };
      return result;
    }

    eventsManager.emit('change-status-required', this, status);
    // Here is where we hook 'any' 3rd party library
    await new Promise((resolve) => {
      eventsManager.once(
        `change-status-completed.${this.id}`,
        (newStatus, err) => {
          this.status = newStatus;
          if (err !== undefined) {
            result = {
              ok: false,
              data: err,
            };
          } else {
            result = {
              ok: true,
              data: { newStatus },
            };
          }
          resolve();
        }
      );
    });

    return result;
  };

  isOffline = () => {
    return this.status === 'offline';
  };
}
