import axios from 'axios';
import { SET_FRIENDS, START_FETCHING, STOP_FETCHING, CHANGE_FRIEND_STATUS } from './types';

export function startFetch() {
    return {
        type: START_FETCHING
    }
}

export function stopFetch() {
    return {
        type: STOP_FETCHING
    }
}

export function setFriends(friends) {
    return {
        type: SET_FRIENDS,
        friends
    }
}

export function changeFriendStatus(user) {
    return {
        type: CHANGE_FRIEND_STATUS,
        user
    }
}

export function getFriends() {
    return dispatch => {
        dispatch(startFetch());
        return axios.get('/api/friends/accepted').then(res => {
            dispatch(setFriends(res.data));
            dispatch(stopFetch());
        })
    }
}
