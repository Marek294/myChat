import React from 'react';

class Greetings extends React.Component {
    render() {
        return (
            <div className="greetContainer">
                <div className="greetMessage text-center">
                    <h2>Welcome to <span className="appNameColor">myChat!</span></h2>
                    <h4>Sign up to chat with your friends.</h4>
                    <div className="buttons">
                        <button className="btn btn-primary">Log In</button>
                        <button className="btn btn-success">Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Greetings;