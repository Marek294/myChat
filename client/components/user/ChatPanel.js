import React from 'react';
import { connect } from 'react-redux';

require("!style-loader!css-loader!sass-loader!../../sass/_ChatPanel.scss");

class ChatPanel extends React.Component {
    render() {
        return (
            <div className="sass-ChatPanel">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Chat</h3>
                    </div>
                </div>
                <div className="panel-body">
                    Chat Panel
                </div>
            </div>
            </div>
        );
    }
}

export default connect(null, null)(ChatPanel);