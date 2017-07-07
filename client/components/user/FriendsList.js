import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders';

import { getFriends, deleteFriend } from '../../actions/friendActions';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");
require("!style-loader!css-loader!sass-loader!../../sass/friendsList.scss");

class FriendsList extends React.Component {
    constructor(props) {
        super(props);

        this.deleteFriend = this.deleteFriend.bind(this);
    }

    componentWillMount() {
        this.props.getFriends();
    }

    deleteFriend(friendId) {
        this.props.deleteFriend(friendId);
    }

    render() {
        let friends;

        if(!this.props.friends[0]) {
            friends = (<div className="text-center noFriends"><p>You have no friends yet.</p><p>Invite someone :)</p></div>);
        } else {
            friends = this.props.friends.map((friend,index) => {
                return (
                    <li key={index} className="list-group-item" ><span>{friend.username}</span><button className="close" onClick={() => this.deleteFriend(friend.id)}><span className="delete">&times;</span></button></li>
                )
            });
        }

        return (
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Friends List</h3>
                    </div>
                </div>
                {this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> :
                    <div className="panel-body"><ul className="list-group">{friends}</ul></div> }
            </div>
        )
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
        deleteFriend: (friendId) => dispatch(deleteFriend(friendId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);