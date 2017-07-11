import { combineReducers } from 'redux';
import flash from './reducers/flash';
import auth from './reducers/auth';
import fetch from './reducers/fetch';
import friends from './reducers/friends';
import pendings from './reducers/pendings';
import messages from './reducers/messages';
import chats from './reducers/chats';
import chat from './reducers/chat';

export default combineReducers({
    auth,
    flash,
    fetch,
    friends,
    pendings,
    messages,
    chats,
    chat,
});