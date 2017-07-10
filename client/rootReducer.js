import { combineReducers } from 'redux';
import flash from './reducers/flash';
import auth from './reducers/auth';
import fetch from './reducers/fetch';
import friends from './reducers/friends';
import pendings from './reducers/pendings';
import chat from './reducers/chat';

export default combineReducers({
    auth,
    flash,
    fetch,
    friends,
    pendings,
    chat,
});