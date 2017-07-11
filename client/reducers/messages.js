import { START_CHAT, SAVE_MESSAGE} from '../actions/types';

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
        default: return state;
    }
}