import {combineReducers} from '@reduxjs/toolkit';
import housesReducer from '../features/houses/housesSlice';
import locksReducer from '../features/locks/locksSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const rootReducer = combineReducers({
  houses: housesReducer,
  locks: locksReducer,
  favorites: favoritesReducer,
});

export default rootReducer;
