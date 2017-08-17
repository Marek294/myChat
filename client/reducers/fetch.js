import { START_FETCHING, STOP_FETCHING, START_CHAT_FETCHING, STOP_CHAT_FETCHING } from '../actions/types';

export default ( state = { }, action = {}) => {
    switch(action.type) {
        case START_FETCHING:
            return {
                isFetching: true
            };
        case STOP_FETCHING:
            return {
                isFetching: false
            };
        case START_CHAT_FETCHING:
            return {
                isChatFetching: true
            };
        case STOP_CHAT_FETCHING:
            return {
                isChatFetching: false
            };
        default: return state;
    }
}