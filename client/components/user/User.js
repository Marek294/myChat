import React from 'react'

import UserGreetings from './UserGreetings';
import FriendPanel from './FriendPanel';
import ChatPanel from './ChatPanel';

require("!style-loader!css-loader!sass-loader!../../sass/_User.scss");

class User extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sass-User">
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
            </div>
        );
    }
}


export default User;