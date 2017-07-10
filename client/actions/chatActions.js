import { START_CHAT, SAVE_MESSAGE } from './types';

export function startChat(friend) {
    return {
        type: START_CHAT,
        friend
    }
}

export function saveMessage(message) {
    return {
        type: SAVE_MESSAGE,
        message
    }
}