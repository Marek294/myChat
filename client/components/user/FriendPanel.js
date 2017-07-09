import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders';
import classnames from 'classnames';
import socket from '../../socket';

import { getFriends, changeFriendStatus } from '../../actions/friendActions';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");
require("!style-loader!css-loader!sass-loader!../../sass/_FriendPanel.scss");

//{this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> : friends }

class FriendPanel extends React.Component {
    constructor(props) {
        super(props);

        this.startChat = this.startChat.bind(this);
    }

    componentWillMount() {
        this.props.getFriends();
        socket.on('SERVER_USER_ONLINE', user => {
            this.props.changeFriendStatus(user, true);
        });

        socket.on('SERVER_USER_OFFLINE', user => {
            this.props.changeFriendStatus(user, false);
        });
    }

    startChat(friendId) {
        console.log(friendId);
    }

    render() {
        let friends;

        if(!this.props.friends[0]) {
            friends = (<div className="text-center noFriends"><p>You have no friends yet.</p><p>Go to Friends panel and invite someone :)</p></div>);
        }
        else {
            friends = this.props.friends.map((friend,index) => {
                let style;
                let styleText;
                if(friend.is_online ) {
                    style = 'green';
                    styleText = 'green-text';
                } else {
                    style = 'grey';
                    styleText = 'grey-text';
                }

                return (
                    <button key={index} onClick={() => this.startChat(friend.id)}><li className="list-group-item" ><div className={classnames("circle", style)} /><span className={styleText}>{friend.username}</span></li></button>
                )
            });
        }

        return (
            <div className="sass-FriendsPanel">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Friends</h3>
                    </div>
                </div>
                {this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> :
                    <div className="panel-body"><ul className="list-group">{friends}</ul></div> }
            </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        friends: state.friends,
        isFetching: state.fetch.isFetching
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getFriends: () => dispatch(getFriends()),
        changeFriendStatus: (user, isOnline) => dispatch(changeFriendStatus(user, isOnline)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPanel);