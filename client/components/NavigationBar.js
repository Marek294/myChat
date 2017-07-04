import React from 'react';

class NavigationBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">myChat</a>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="#">Sign Up</a></li>
                        <li><a href="#">Log In</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavigationBar