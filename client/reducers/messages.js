import { START_CHAT, SAVE_MESSAGE, SET_MORE_MESSAGES} from '../actions/types';

export default ( state = [ ], action = {}) => {
    switch(action.type) {
        case START_CHAT:
            return action.messages;
        case SAVE_MESSAGE: {
            return [
                ...state,
                action.message
            ]
        }
        case SET_MORE_MESSAGES: {
            let messages = state;
            messages.push(action.messages);
            console.log(messages);
            return messages;
        }
        default: return state;
    }
}