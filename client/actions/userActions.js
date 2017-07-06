import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './types';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}

export function login(token) {
        localStorage.setItem('jwtToken', token);
        setAuthorizationToken(token);
    return dispatch => {
        dispatch(setCurrentUser(jwtDecode(token)));
    }
}

export function logout() {
    return dispatch => {
        axios.put('/api/users/offline');
        localStorage.removeItem('jwtToken');
        setAuthorizationToken();
        dispatch(setCurrentUser());
    }
}

export function userSignupRequest(userData) {
    return dispatch => {
        return axios.post('/api/users', userData);
    }
}

export function userLoginRequest(userData) {
    return dispatch => {
        return axios.post('/api/auth', userData).then(res => {
            localStorage.setItem('jwtToken', res.data.token);
            setAuthorizationToken(res.data.token);
            dispatch(setCurrentUser(jwtDecode(res.data.token)));
        });
    }
}