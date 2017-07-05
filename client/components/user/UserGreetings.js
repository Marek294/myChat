import React from 'react';
import { connect } from 'react-redux';

class UserGreetings extends React.Component {
    render() {
        let username;
        if(this.props.user) {
            username = this.props.user.username;
        }
        return (
            <div className="greetMessage text-center">
                <h2>Welcome <span className="appNameColor username">{username}</span></h2>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, null)(UserGreetings);