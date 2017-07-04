import React from 'react';
import NavigationBar from './NavigationBar';
import Greetings from './Greetings';

class App extends React.Component {
    render() {
        return (
            <div className="background">
                <div className="container full-height">
                    <NavigationBar />
                    <Greetings />
                </div>
            </div>
        )
    }
}

export default App;