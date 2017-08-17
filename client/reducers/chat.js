import { SET_CHAT, CLEAR_CHAT } from '../actions/types';

export default ( state = {}, action = {}) => {
    switch(action.type) {
        case SET_CHAT:
            return action.chat;
        case CLEAR_CHAT:
            return {};
        default: return state;
    }
}