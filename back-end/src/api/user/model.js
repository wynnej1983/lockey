import users from '../../../storage/users.json';

export default class User {
  constructor({ id, name, favorites }) {
    this.id = id;
    this.name = name;
    this.favorites = new Set(favorites);
  }

  static users = [];

  static all = () => {
    if (this.users.length === 0)
      this.users = users.map((user) => new User(user));
    return this.users;
  };

  static get = (id) => {
    return this.all().find((user) => user.id === id);
  };

  getFavorites = () => {
    return this.favorites;
  };

  addFavorite = (lockId) => {
    return this.favorites.add(lockId);
  };

  removeFavorite = (lockId) => {
    return this.favorites.delete(lockId);
  };
}
