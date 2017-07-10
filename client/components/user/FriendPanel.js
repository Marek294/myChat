import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders';
import classnames from 'classnames';
import socket from '../../socket';
import findIndex from 'lodash/findIndex';

import { getFriends, changeFriendStatus } from '../../actions/friendActions';
import { startChat } from '../../actions/chatActions';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");
require("!style-loader!css-loader!sass-loader!../../sass/_FriendPanel.scss");

//{this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> : friends }

class FriendPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newMessages: []
        };

        this.startChat = this.startChat.bind(this);
        this.showNewMessagesNumber = this.showNewMessagesNumber.bind(this);
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

    componentDidMount() {
        socket.on('SERVER_SEND_MESSAGE', message => {
            if(this.props.chat.friend) {
                if (this.props.chat.friend.id != message.userId) {
                    let messages = this.state.newMessages;
                    const index = findIndex(this.state.newMessages, {userId: message.userId});

                    if (index > -1) {
                        messages[index].number++;

                        this.setState({
                            newMessages: messages
                        });
                    } else {
                        messages.push({
                            userId: message.userId,
                            number: 1,
                        });

                        this.setState({
                            newMessages: messages
                        });
                    }
                }
            } else {
                let messages = this.state.newMessages;
                messages.push({
                    userId: message.userId,
                    number: 1,
                });

                this.setState({
                    newMessages: messages
                });
            }
        });
    }

    showNewMessagesNumber(friend) {
        const index = findIndex(this.state.newMessages, { userId: friend.id });
        if(index > -1) return this.state.newMessages[index].number;
        else return null;
    }

    startChat(friend) {
        this.props.startChat(friend);

        const index = findIndex(this.state.newMessages, { userId: friend.id });
        if(index > -1) {
            let messages = this.state.newMessages;
            messages.splice(index,1);
            this.setState({
                newMessages: messages
            });
        }
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
                    <button key={index} onClick={() => this.startChat(friend)}>
                        <li className="list-group-item" >
                            <div className={classnames("circle", style)} />
                            <div className="username" > <span className={styleText}>{friend.username}</span> </div>
                            <span className="newMessage">{this.showNewMessagesNumber(friend)}</span>
                        </li>
                    </button>
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
        isFetching: state.fetch.isFetching,
        chat: state.chat,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getFriends: () => dispatch(getFriends()),
        changeFriendStatus: (user, isOnline) => dispatch(changeFriendStatus(user, isOnline)),
        startChat: (friend) => dispatch(startChat(friend)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPanel);