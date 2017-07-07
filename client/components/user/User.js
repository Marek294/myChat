import React from 'react'

import UserGreetings from './UserGreetings';
import FriendPanel from './FriendPanel';
import ChatPanel from './ChatPanel';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");

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