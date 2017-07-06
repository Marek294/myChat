import { combineReducers } from 'redux';
import flash from './reducers/flash';
import auth from './reducers/auth';
import fetch from './reducers/fetch';
import friends from './reducers/friends';

export default combineReducers({
    auth,
    flash,
    fetch,
    friends,
});