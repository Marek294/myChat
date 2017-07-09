import React from 'react';
import { Link } from 'react-router';

require("!style-loader!css-loader!sass-loader!../sass/_Greetings.scss");

class Greetings extends React.Component {
    render() {
        return (
            <div className="sass-Greetings">
            <div className="greetContainer">
                <div className="greetMessage text-center">
                    <h2>Welcome to <span className="appNameColor">myChat!</span></h2>
                    <h4>Sign up to chat with your friends.</h4>
                    <div className="buttons">
                        <Link className="btn btn-primary" to="/login">Log In</Link>
                        <Link className="btn btn-success" to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default Greetings;