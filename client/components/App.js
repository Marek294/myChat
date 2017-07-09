import React from 'react';
import NavigationBar from './NavigationBar';
import FlashMessage from './flash/FlashMessage';

require("!style-loader!css-loader!sass-loader!../sass/_all.scss");

class App extends React.Component {
    render() {
        return (
            <div className="background">
                <div className="container full-height">
                    <NavigationBar />
                    <FlashMessage />
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App;