import { SET_CHATS } from '../actions/types';

export default ( state = [], action = {}) => {
    switch(action.type) {
        case SET_CHATS:
            return action.chats;
        default: return state;
    }
}