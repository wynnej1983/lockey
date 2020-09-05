import {createSlice} from '@reduxjs/toolkit';
import * as api from '../../api';
import {updateLockStatusSuccess} from '../locks/locksSlice';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    error: null,
  },
  reducers: {
    getFavoritesSuccess: (state, {payload}) => {
      state.favorites = payload;
      state.error = null;
    },
    getFavoritesFailed: (state, {payload}) => {
      state.error = payload;
    },
    addFavoriteSuccess: (state, {payload}) => {
      state.favorites.push(payload);
      state.error = null;
    },
    addFavoriteFailed: (state, {payload}) => {
      state.error = payload;
    },
    removeFavoriteSuccess: (state, {payload}) => {
      const idx = state.favorites.indexOf(payload);
      state.favorites.splice(idx, 1);
      state.error = null;
    },
    removeFavoriteFailed: (state, {payload}) => {
      state.error = payload;
    },
  },
  extraReducers: {
    [updateLockStatusSuccess]: (state, {payload}) => {
      const lock = state.favorites.find(
        (favorite) => favorite.id === payload.lockId,
      );
      if (lock) {
        lock.status = payload.status;
      }
      state.error = null;
    },
  },
});

export const {
  getFavoritesSuccess,
  getFavoritesFailed,
  addFavoriteSuccess,
  addFavoriteFailed,
  removeFavoriteSuccess,
  removeFavoriteFailed,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const fetchFavorites = () => async (dispatch) => {
  try {
    const favorites = await api.getFavorites();
    dispatch(getFavoritesSuccess(favorites));
  } catch (err) {
    dispatch(getFavoritesFailed(err.toString()));
  }
};

export const addFavorite = (lock) => async (dispatch) => {
  try {
    await api.addFavorite(lock.id);
    dispatch(addFavoriteSuccess(lock));
  } catch (err) {
    dispatch(addFavoriteFailed(err.toString()));
  }
};

export const removeFavorite = (lock) => async (dispatch) => {
  try {
    await api.removeFavorite(lock.id);
    dispatch(removeFavoriteSuccess(lock.id));
  } catch (err) {
    dispatch(removeFavoriteFailed(err.toString()));
  }
};
