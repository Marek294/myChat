import findIndex from 'lodash/findIndex';

import { SET_FRIENDS, CHANGE_FRIEND_STATUS } from '../actions/types';

export default ( state = [], action = {}) => {
    switch(action.type) {
        case SET_FRIENDS:
            return action.friends;
        case CHANGE_FRIEND_STATUS: {
            const index = findIndex(state, { id: action.user.id });
            let friends = state;
            friends[index].is_online = true;

            return friends;
        }
        default: return state;
    }
}