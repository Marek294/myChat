import axios from 'axios';

export default function(token) {
    if(token) {
        axios.defaults.headers.common['AuthorizationToken'] = `Bearer ${token}`;
    } else delete axios.defaults.headers.common['AuthorizationToken'];
}