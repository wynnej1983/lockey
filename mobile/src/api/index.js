import Config from 'react-native-config';

const {API_URL} = Config;

export const getHouses = async () => {
  const res = await fetch(`${API_URL}/houses`, {
    method: 'GET',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  const houses = await res.json();
  return houses;
};

export const getLocks = async (houseId) => {
  const res = await fetch(`${API_URL}/houses/${houseId}/locks`, {
    method: 'GET',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  const locks = await res.json();
  return locks;
};

export const updateLockStatus = (houseId, lockId, status) => {
  return fetch(`${API_URL}/houses/${houseId}/locks/${lockId}/locking`, {
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
  });
};

export const getFavorites = async () => {
  const res = await fetch(`${API_URL}/locks/favorites`, {
    method: 'GET',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  const favorites = await res.json();
  return favorites;
};

export const addFavorite = async (lockId) => {
  const res = await fetch(`${API_URL}/locks/${lockId}/favorite`, {
    method: 'PUT',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  return res.ok;
};

export const removeFavorite = async (lockId) => {
  const res = await fetch(`${API_URL}/locks/${lockId}/favorite`, {
    method: 'DELETE',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  return res.ok;
};
