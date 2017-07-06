import { START_FETCHING, STOP_FETCHING } from '../actions/types';

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
        default: return state;
    }
}