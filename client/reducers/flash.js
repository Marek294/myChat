import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../actions/types';

export default ( state = {}, action = {}) => {
    switch(action.type) {
        case ADD_FLASH_MESSAGE:
            return {
                    type: action.message.type,
                    text: action.message.text
                };
        case DELETE_FLASH_MESSAGE:
            return {};
        default: return state;
    }
}