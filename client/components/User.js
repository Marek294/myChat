import React from 'react'
import { connect } from 'react-redux'
import socket from '../socket';

import UserGreetings from './user/UserGreetings';
import FriendPanel from './user/FriendPanel';
import ChatPanel from './user/ChatPanel';

require("!style-loader!css-loader!sass-loader!../sass/loader.scss");

class User extends React.Component {
    // componentWillMount() {
    //     socket.emit('USER_ONLINE', this.props.user);
    //
    //     socket.on('SOCKET_ID', id => {
    //         let user = this.props.user;
    //         user.socketId = id;
    //         socket.emit('USER_INFORMATION', user);
    //     })
    // }

    componentDidMount() {
        socket.emit('USER_ONLINE', this.props.user);

        socket.on('SOCKET_ID', id => {
            let user = this.props.user;
            user.socketId = id;
            socket.emit('USER_INFORMATION', user);
        })
    }

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

function mapStateToProps (state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, null)(User);