import axios from 'axios';
import { START_CHAT, SAVE_MESSAGE, START_FETCHING, STOP_FETCHING, SET_CHATS, SET_CHAT } from './types';

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

export function setMessages(messages) {
    return {
        type: START_CHAT,
        messages
    }
}

export function setChats(chats) {
    return {
        type: SET_CHATS,
        chats
    }
}

export function setChat(chat) {
    return {
        type: SET_CHAT,
        chat
    }
}

export function getChats() {
    return dispatch => {
        dispatch(startFetch());
        return axios.get('/api/chats/all').then(res => {
            dispatch(setChats(res.data));
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

export function startChat(chat) {
    return dispatch => {
        dispatch(startFetch());
        return axios.get(`/api/messages/${chat.id}`).then(res => {
            dispatch(setChat(chat));
            dispatch(setMessages(res.data));
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

export function pushMessage(message) {
    return {
        type: SAVE_MESSAGE,
        message
    }
}

export function saveMessage(message) {
    return dispatch => {
        return axios.post('api/messages/',message).then(res => {
            return dispatch(pushMessage(res.data));
        });
    }
}