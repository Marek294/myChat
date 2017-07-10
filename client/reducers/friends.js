import findIndex from 'lodash/findIndex';

import { SET_FRIENDS, CHANGE_FRIEND_STATUS, DELETE_FRIEND, ADD_FRIEND } from '../actions/types';

export default ( state = [], action = {}) => {
    switch(action.type) {
        case SET_FRIENDS:
            return action.friends;
        case CHANGE_FRIEND_STATUS: {
            const index = findIndex(state, { id: action.user.id });
            if(index > -1 ) {
                let changeFriend = state[index];
                changeFriend.is_online = action.isOnline;

                return [
                    ...state.slice(0,index),
                    changeFriend,
                    ...state.slice(index+1)
                ];
            } else {
                return state;
            }


        }
        case DELETE_FRIEND: {
            const index = findIndex(state, { id: action.friend.id });

            return [
                ...state.slice(0,index),
                ...state.slice(index+1)
            ]
        }
        case ADD_FRIEND:
            return [
                ...state,
                action.friend
            ];
        default: return state;
    }
}