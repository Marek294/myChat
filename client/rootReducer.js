import { combineReducers } from 'redux';
import flash from './reducers/flash';
import auth from './reducers/auth';

export default combineReducers({
    auth,
    flash,
});