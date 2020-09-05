import {Vibration} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import Snackbar from 'react-native-snackbar';

import * as api from '../../api';

const locksSlice = createSlice({
  name: 'locks',
  initialState: {
    locks: [],
    error: null,
  },
  reducers: {
    getLocksSuccess: (state, {payload}) => {
      state.locks = payload;
      state.error = null;
    },
    getLocksFailed: (state, {payload}) => {
      state.error = payload;
    },
    updateLockStatusSuccess: (state, {payload}) => {
      const lock = state.locks.find((lock) => lock.id === payload.lockId);
      if (lock) {
        lock.status = payload.status;
      }
      state.error = null;
    },
    updateLockStatusFailed: (state, {payload}) => {
      state.error = payload;
    },
  },
});

export const {
  getLocksSuccess,
  getLocksFailed,
  updateLockStatusSuccess,
  updateLockStatusFailed,
} = locksSlice.actions;

export default locksSlice.reducer;

export const fetchLocks = (houseId) => async (dispatch) => {
  try {
    const locks = await api.getLocks(houseId);
    dispatch(getLocksSuccess(locks));
  } catch (err) {
    dispatch(getLocksFailed(err.toString()));
  }
};

export const updateLockStatus = (
  houseId,
  lockId,
  lockName,
  status,
  viaWebsocketPush = false,
) => async (dispatch) => {
  try {
    if (!viaWebsocketPush) {
      const res = await api.updateLockStatus(houseId, lockId, status);
      if (res.ok) {
        dispatch(updateLockStatusSuccess({lockId, status}));
        const pattern = status === 'locked' ? 200 : [0, 200, 100, 200];
        Vibration.vibrate(pattern);
        Snackbar.show({
          text: `Successfully ${status} ${lockName}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#00aea9',
          action: {
            text: 'OK',
            textColor: '#fbd042',
          },
        });
      } else {
        throw new Error('Failed to update lock status', res.status);
      }
    } else {
      dispatch(updateLockStatusSuccess({lockId, status}));
    }
  } catch (err) {
    dispatch(updateLockStatusFailed(err.toString()));
    showSnackbarError(status, lockName);
  }
};

const showSnackbarError = (status, lockName) => {
  Snackbar.show({
    text: `Failed to ${
      status === 'locked' ? 'lock' : 'unlock'
    } ${lockName}, please try again`,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: '#f54336',
    action: {
      text: 'OK',
      textColor: '#ffffff',
    },
  });
};
