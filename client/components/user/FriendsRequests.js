import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders';

import { getPendingFriends, deletePendingFriend, acceptPendingFriend } from '../../actions/friendActions';

require("!style-loader!css-loader!sass-loader!../../sass/friendRequest.scss");

class FriendsRequests extends React.Component {
    constructor(props) {
        super(props);

        this.deleteFriend = this.deleteFriend.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
    }

    componentWillMount() {
        this.props.getPendingFriends();
    }

    deleteFriend(friendId) {
        this.props.deletePendingFriend(friendId);
    };

    acceptFriend(friendId) {
        this.props.acceptPendingFriend(friendId);
    }

    render() {
        let pendings;

        if(!this.props.pendings[0]) {
            pendings = (<div className="text-center noPendings"><p>You have no friends request</p></div>);
        } else {
            pendings = this.props.pendings.map((friend,index) => {
                return (
                    <li key={index} className="list-group-item" >
                        <span>{friend.username}</span>
                        <div>
                            <button className="close" onClick={() => this.deleteFriend(friend.id)}><span className="delete">&times;</span></button>
                            <button className="close" onClick={() => this.acceptFriend(friend.id)}><span className="accept">&#x2713;</span></button>
                        </div>
                    </li>
                )
            });
        }

        return (
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">Friends Requests</h3>
                    </div>
                </div>
                {this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> :
                    <div className="panel-body"><ul className="list-group">{pendings}</ul></div> }
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        pendings: state.pendings,
        isFetching: state.fetch.isFetching
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPendingFriends: () => dispatch(getPendingFriends()),
        deletePendingFriend: (friendId) => dispatch(deletePendingFriend(friendId)),
        acceptPendingFriend: (friendId) => dispatch(acceptPendingFriend(friendId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsRequests);