import { combineReducers } from 'redux';
import authReducer from './authReducer';
import gameReducer from './gameReducer';

const mainReducer = combineReducers({
  auth: authReducer,
  game: gameReducer
});

export default mainReducer;