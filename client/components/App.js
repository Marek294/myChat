import React from 'react';
import NavigationBar from './NavigationBar';

class App extends React.Component {
    render() {
        return (
            <div className="background">
                <div className="container full-height">
                    <NavigationBar />
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App;