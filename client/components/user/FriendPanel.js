import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders'
import classnames from 'classnames';
import socket from '../../socket';

import { getFriends, changeFriendStatus } from '../../actions/friendActions';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");
require("!style-loader!css-loader!sass-loader!../../sass/friends.scss");

//{this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> : friends }

class FriendPanel extends React.Component {
    constructor(props) {
        super(props);

        this.startChat = this.startChat.bind(this);
    }

    componentWillMount() {
        this.props.getFriends();
        socket.on('SERVER_USER_ONLINE', user => {
            this.props.changeFriendStatus(user);
        });
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         friends: nextProps.friends
    //     });
    // }

    startChat(friendId) {
        console.log(friendId);
    }

    render() {
        let friends = this.props.friends.map((friend,index) => {
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
        return (
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Friends</h3>
                    </div>
                </div>
                {this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> :
                    <div className="panel-body"><ul className="list-group">{friends}</ul></div> }
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
        getFriends: () => {dispatch(getFriends())},
        changeFriendStatus: (user) => {dispatch(changeFriendStatus(user))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPanel);