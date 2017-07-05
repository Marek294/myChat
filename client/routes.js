import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Greetings from './components/Greetings';
import Signup from './components/Signup';
import Login from './components/Login';
import User from './components/User';

import requireAuth from './utils/requireAuth';

export default (
    <Route path="/" component={App} >
        <IndexRoute component={Greetings} />
        <Route path="signup" component={Signup} />
        <Route path="login" component={Login} />
        <Route path="user" component={requireAuth(User)} />
    </Route>
)