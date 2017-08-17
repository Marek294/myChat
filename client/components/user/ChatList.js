import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'react-loaders';
import classnames from 'classnames';
import socket from '../../socket';
import findIndex from 'lodash/findIndex';

import { startChat, getChats, changeChatStatus } from '../../actions/chatActions';

require("!style-loader!css-loader!sass-loader!../../sass/loader.scss");
require("!style-loader!css-loader!sass-loader!../../sass/_ChatList.scss");

//{this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> : friends }

class ChatList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newMessages: []
        };

        this.startChat = this.startChat.bind(this);
        this.showNewMessagesNumber = this.showNewMessagesNumber.bind(this);
    }

    componentWillMount() {
        this.props.getChats();

        socket.on('SERVER_USER_ONLINE', user => {
            this.props.chats.map(chat => {
                if(chat.members.indexOf(user.id) > -1) {
                    this.props.changeChatStatus(chat, true);
                };
            });
        });

        socket.on('SERVER_USER_OFFLINE', user => {
            this.props.chats.map(chat => {
                if(chat.members.indexOf(user.id) > -1) {
                    this.props.changeChatStatus(chat, false);
                };
            });
        });

        socket.on(`SERVER_NEW_MESSAGE`, (chatId) => {
            if(!this.props.chat || chatId !== this.props.chat.id) {
                this.incrementNumberOfNewMessages(chatId);
            }
        });
    }

    showNewMessagesNumber(chat) {
        const index = findIndex(this.state.newMessages, { chatId: chat.id });
        if(index > -1) return this.state.newMessages[index].number;
        else return null;
    }

    incrementNumberOfNewMessages(chatId) {
        const index = findIndex(this.state.newMessages, { chatId: chatId });
        if(index > -1) {
            let newMessages = this.state.newMessages;
            newMessages[index].number++;
            this.setState({
                newMessages: newMessages
            })
        } else {
            let newMessages = this.state.newMessages;
            newMessages.push({
                chatId: chatId,
                number: 1
            });
            this.setState({
                newMessages: newMessages
            })
        }
    }

    startChat(chat) {
        this.props.startChat(chat);

        const index = findIndex(this.state.newMessages, { chatId: chat.id });
        if(index > -1) {
            let newMessages = this.state.newMessages;
            newMessages.splice(index,1);
            this.setState({
                newMessages: newMessages
            });
        }
    }

    render() {
        let chats;

        if(!this.props.chats[0]) {
            chats = (<div className="text-center noFriends"><p>You have no friends yet.</p><p>Go to Friends panel and invite someone :)</p></div>);
        }
        else {
            chats = this.props.chats.map((chat,index) => {
                let style;
                let styleText;
                style = 'green';
                styleText = 'green-text';
                if(chat.online) {
                    style = 'green';
                    styleText = 'green-text';
                } else {
                    style = 'grey';
                    styleText = 'grey-text';
                }

                return (
                    <button key={index} onClick={() => this.startChat(chat)}>
                        <li className="list-group-item" >
                            <div className={classnames("circle", style)} />
                            <div className="username" > <span className={styleText}>{chat.name}</span> </div>
                            <span className="newMessage">{this.showNewMessagesNumber(chat)}</span>
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
                        <h3 className="panel-title">Chats</h3>
                    </div>
                </div>
                {this.props.isFetching ? <div className="parent" ><Loader type="ball-pulse" active /></div> :
                    <div className="panel-body"><ul className="list-group">{chats}</ul></div> }
            </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        chats: state.chats,
        isFetching: state.fetch.isFetching,
        currentUser: state.auth.user,
        chat: state.chat,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getChats: () => dispatch(getChats()),
        startChat: (chat) => dispatch(startChat(chat)),
        changeChatStatus: (chat, online) => dispatch(changeChatStatus(chat,online)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);