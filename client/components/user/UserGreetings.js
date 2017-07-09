import React from 'react';
import { connect } from 'react-redux';

require("!style-loader!css-loader!sass-loader!../../sass/_UserGreetings.scss");

class UserGreetings extends React.Component {
    render() {
        let username;
        if(this.props.user) {
            username = this.props.user.username;
        }
        return (
            <div className="sass-UserGreetings">
            <div className="greetMessage text-center">
                <h2>Welcome</h2><span className="appNameColor username">{username}</span>
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

export default connect(mapStateToProps, null)(UserGreetings);