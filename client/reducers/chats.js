import findIndex from 'lodash/findIndex';

import { SET_CHATS, CHANGE_CHAT_STATUS } from '../actions/types';

export default ( state = [], action = {}) => {
    switch(action.type) {
        case SET_CHATS:
            return action.chats;
        case CHANGE_CHAT_STATUS: {
            const index = findIndex(state, { id: action.chat.id });
            if(index > -1 ) {
                let changeChat = state[index];
                changeChat.online = action.online;

                return [
                    ...state.slice(0,index),
                    changeChat,
                    ...state.slice(index+1)
                ];
            } else {
                return state;
            }
        }
        default: return state;
    }
}