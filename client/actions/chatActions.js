import axios from 'axios';
import { START_CHAT, SAVE_MESSAGE, START_FETCHING, STOP_FETCHING, SET_CHATS, SET_CHAT, CHANGE_CHAT_STATUS, CLEAR_CHAT, START_CHAT_FETCHING, STOP_CHAT_FETCHING, SET_MORE_MESSAGES } from './types';

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

export function startChatFetch() {
    return {
        type: START_CHAT_FETCHING
    }
}

export function stopChatFetch() {
    return {
        type: STOP_CHAT_FETCHING
    }
}

export function setMessages(messages) {
    return {
        type: START_CHAT,
        messages
    }
}

export function setMoreMessages(messages) {
    return {
        type: SET_MORE_MESSAGES,
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
        dispatch(startChatFetch());
        return axios.get(`/api/messages/${chat.id}/1`).then(res => {
            dispatch(setChat(chat));
            dispatch(setMessages(res.data));
            dispatch(stopChatFetch());
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
            dispatch(stopChatFetch());
        })
    }
}

export function getMoreMessages(chat, page) {
    return dispatch => {
        return axios.get(`/api/messages/${chat.id}/${page}`).then(res => {
            dispatch(setMoreMessages(res.data));
        }, err => {
            dispatch(addFlashMessage({
                type: 'error',
                text: err.response.data.errors
            }));
        })
    }
}

export function changeChatStatus(chat, online) {
    return {
        type: CHANGE_CHAT_STATUS,
        chat,
        online
    }
}

export function clearChat() {
    return {
        type: CLEAR_CHAT
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