import React from 'react';
import { connect } from 'react-redux'
import socket from '../socket';

class UserPage extends React.Component {
    componentDidMount() {
        socket.on('pong', () => {
            socket.emit('USER_ONLINE', this.props.user);
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