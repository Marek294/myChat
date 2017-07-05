import React from 'react';
import { connect } from 'react-redux';

class FriendPanel extends React.Component {
    render() {
        return (
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Friends</h3>
                    </div>
                </div>
                <div className="panel-body">
                    Friend List
                </div>
            </div>
        );
    }
}

export default connect(null, null)(FriendPanel);