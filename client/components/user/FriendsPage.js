import React from 'react';

import FriendsRequests from './FriendsRequests';
import FriendsList from './FriendsList';
import FriendInvite from './FriendInvite';

require("!style-loader!css-loader!sass-loader!../../sass/friendsPage.scss");

class FriendsPage extends React.Component {
    render() {
        return (
            <div className="parentFriendsPageDiv">
                <div className="friendInvitation">
                    <FriendInvite />
                </div>
                <div className="parentFriendsManagementDiv">
                    <div className="friendsRequestsDiv">
                        <FriendsRequests />
                    </div>
                    <div className="friendsListDiv">
                        <FriendsList />
                    </div>
                </div>
            </div>
        );
    }
}

export default FriendsPage;