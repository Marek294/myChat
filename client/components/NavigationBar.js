import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import socket from '../socket';

import { logout } from '../actions/userActions';
import { addFlashMessage } from '../actions/flashActions';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        socket.emit('USER_OFFLINE', this.props.user);
        this.props.logout();
        this.props.addFlashMessage({
            type: 'success',
            text: 'You have log out successfully!'
        });
    }

    render() {
        let links;
        let brand;
        if(!this.props.isAuthenticated) {
            brand = (<Link className="navbar-brand" to="/">myChat</Link>);
            links = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                </ul>
            );
        } else {
            brand = (<Link className="navbar-brand" to="/user">myChat</Link>);
            links = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link href="#" to="/friends">Friends</Link></li>
                    <li><a href="#" onClick={this.logout}>Log out</a></li>
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        {brand}
                    </div>
                    {links}
                </div>
            </nav>
        );
    }
}

function mapStateToProps (state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        logout: () => dispatch(logout()),
        addFlashMessage: (message) => dispatch(addFlashMessage(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar)