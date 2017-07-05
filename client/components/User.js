import React from 'react'

import UserGreetings from './user/UserGreetings';
import FriendPanel from './user/FriendPanel';
import ChatPanel from './user/ChatPanel';

class User extends React.Component {
    render() {
        return (
            <div className="mainUserContainer">
                <div className="userGreetings">
                    <UserGreetings />
                </div>
                <div className="friendsChatContainer">
                    <div className="friendsContainer">
                        <FriendPanel />
                    </div>
                    <div className="chatContainer">
                        <ChatPanel />
                    </div>
                </div>
            </div>
        );
    }
}

export default User;