import { combineReducers } from '@reduxjs/toolkit';
import transfer from '@/app/transfer/reducer';

const reducers = combineReducers({
  transfer,
});

export default reducers;
