import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from 'lodash/isEmpty';

export default ( state = {}, action = {}) => {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmpty(action.user),
                user: action.user
            };
        default: return state;
    }
}