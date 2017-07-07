import React from 'react';
import { connect } from 'react-redux'
import socket from '../socket';

class UserPage extends React.Component {
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
            <div>
                {this.props.children}
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, null)(UserPage);