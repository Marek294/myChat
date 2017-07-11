import axios from 'axios';
import { addFlashMessage } from './flashActions';
import { SET_FRIENDS, START_FETCHING, STOP_FETCHING, CHANGE_FRIEND_STATUS, DELETE_FRIEND, SET_PENDING_FRIENDS, DELETE_PENDING_FRIEND, ADD_FRIEND } from './types';

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

export function setPendingFriends(friends) {
    return {
        type: SET_PENDING_FRIENDS,
        friends
    }
}

export function deleteFriendFromStore(friend) {
    return {
        type: DELETE_FRIEND,
        friend
    }
}

export function deletePendingFriendFromStore(friend) {
    return {
        type: DELETE_PENDING_FRIEND,
        friend
    }
}

export function addFriendToStore(friend) {
    return {
        type: ADD_FRIEND,
        friend
    }
}

export function changeFriendStatus(user, isOnline) {
    return {
        type: CHANGE_FRIEND_STATUS,
        user,
        isOnline
    }
}

export function getFriends() {
    return dispatch => {
        dispatch(startFetch());
        return axios.get('/api/friends/accepted').then(res => {
            dispatch(setFriends(res.data));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}

export function getPendingFriends() {
    return dispatch => {
        dispatch(startFetch());
        return axios.get('/api/friends/pending').then(res => {
            dispatch(setPendingFriends(res.data));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}

export function deleteFriend(friendId) {
    return dispatch => {
        dispatch(startFetch());
        return axios.delete(`/api/friends/${friendId}`).then(res => {
            dispatch(deleteFriendFromStore(res.data));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}

export function deletePendingFriend(friendId) {
    return dispatch => {
        dispatch(startFetch());
        return axios.delete(`/api/friends/${friendId}`).then(res => {
            dispatch(deletePendingFriendFromStore(res.data));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}

export function acceptPendingFriend(friendId) {
    return dispatch => {
        dispatch(startFetch());
        const body = {
            friendId
        };
        return axios.put('/api/friends/accept',body).then(res => {
            dispatch(addFriendToStore(res.data));
            dispatch(deletePendingFriendFromStore(res.data));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}

export function inviteFriend(friendEmail) {
    return dispatch => {
        dispatch(startFetch());
        return axios.post('/api/friends/',friendEmail).then(res => {
            dispatch(addFlashMessage({
                type: 'success',
                text: 'Friend request was send'
            }));
            dispatch(stopFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopFetch());
        })
    }
}
