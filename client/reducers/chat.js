import { START_CHAT, SAVE_MESSAGE} from '../actions/types';

export default ( state = { friend: {}, messages: []}, action = {}) => {
    switch(action.type) {
        case START_CHAT:
            return {
                friend: action.friend,
                messages: []
            };
        case SAVE_MESSAGE: {
            let messages = state.messages;
            messages.push(action.message);
            return {
                friend: state.friend,
                messages: messages
            };
        }
        default: return state;
    }
}