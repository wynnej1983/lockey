import houses from '../../../storage/houses.json';
import Lock from '../lock/model';

export default class House {
  constructor({ id, name, locks }) {
    this.name = name;
    this.id = id;
    this.locks = locks.map((lock) => new Lock({ ...lock, houseId: id }));
  }

  static houses = [];

  static all = () => {
    if (this.houses.length === 0)
      this.houses = houses.map((house) => new House(house));
    return this.houses;
  };

  static get = (id) => {
    return this.all().find((house) => house.id === id);
  };

  getLock = (lockId) => {
    return this.locks.find((lock) => lock.id === lockId);
  };
}

