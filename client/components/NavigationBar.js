import React from 'react';
import { Link } from 'react-router';

class NavigationBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">myChat</Link>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Log In</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavigationBar