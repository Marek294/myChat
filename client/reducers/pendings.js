import findIndex from 'lodash/findIndex';

import { SET_PENDING_FRIENDS, DELETE_PENDING_FRIEND } from '../actions/types';

export default ( state = [], action = {}) => {
    switch(action.type) {
        case SET_PENDING_FRIENDS:
            return action.friends;
        case DELETE_PENDING_FRIEND: {
            const index = findIndex(state, { id: action.friend.id });

            return [
                ...state.slice(0,index),
                ...state.slice(index+1)
            ]
        }
        default: return state;
    }
}