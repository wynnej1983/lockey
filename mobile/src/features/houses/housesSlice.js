import {createSlice} from '@reduxjs/toolkit';
import * as api from '../../api';

const housesSlice = createSlice({
  name: 'houses',
  initialState: {
    houses: [],
    error: null,
  },
  // reducers actions
  reducers: {
    getHousesSuccess: (state, {payload}) => {
      state.houses = payload;
      state.error = null;
    },
    getHousesFailed: (state, {payload}) => {
      state.error = payload;
    },
  },
});

export const {getHousesSuccess, getHousesFailed} = housesSlice.actions;

export default housesSlice.reducer;

export const fetchHouses = () => async (dispatch) => {
  try {
    const houses = await api.getHouses();
    dispatch(getHousesSuccess(houses));
  } catch (err) {
    dispatch(getHousesFailed(err.toString()));
  }
};
