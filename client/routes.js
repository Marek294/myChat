import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Greetings from './components/Greetings';
import Signup from './components/Signup';
import Login from './components/Login';
import UserPage from './components/UserPage';
import User from './components/user/User';
import FriendsPage from './components/user/FriendsPage';

import requireAuth from './utils/requireAuth';

export default (
    <Route path="/" component={App} >
        <IndexRoute component={Greetings} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user" component={requireAuth(UserPage)} >
            <IndexRoute component={User} />
            <Route path="/friends" component={FriendsPage} />
        </Route>
    </Route>
)