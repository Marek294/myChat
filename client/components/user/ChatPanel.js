import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import socket from '../../socket';
import isEmpty from 'lodash/isEmpty';

import { saveMessage, pushMessage } from '../../actions/chatActions';

require("!style-loader!css-loader!sass-loader!../../sass/_ChatPanel.scss");

class ChatPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
        };

        this.onChange = this.onChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        //socket.removeAllListeners('SERVER_NEW_POST:'+this.props.chat.id);

        // socket.on('SERVER_SEND_MESSAGE', (message) => {
        //     if(this.props.chat.friend) {
        //         if (this.props.chat.friend.id == message.userId) {
        //             this.props.saveMessage(message);
        //         }
        //     }
        // });

        // socket.on('SERVER_NEW_MESSAGE:'+nextProps.chat.id, (message) => {
        //     console.log(data);
        //     this.props.saveMessage(message);
        // });
    }

    componentWillReceiveProps(nextProps) {
        socket.removeAllListeners('SERVER_NEW_MESSAGE:'+this.props.chat.id);
        socket.removeAllListeners('SERVER_START_TYPING:'+this.props.chat.id);
        socket.removeAllListeners('SERVER_STOP_TYPING:'+this.props.chat.id);

        socket.on(`SERVER_NEW_MESSAGE:${nextProps.chat.id}`, (message) => {
            //console.log(message);
            this.props.pushMessage(message);
        });

        socket.on(`SERVER_START_TYPING:${nextProps.chat.id}`, (username) => {
            //console.log(message);
            this.setState({
                typingUser: {
                    [username]: true
                }
            })
        });

        socket.on(`SERVER_STOP_TYPING:${nextProps.chat.id}`, (username) => {
            //console.log(message);
            this.setState({
                typingUser: {
                    [username]: false
                }
            })
        });
    }

    componentDidUpdate(){
        const scroll = findDOMNode(this.refs.scroll);
        scroll.scrollTop = scroll.scrollHeight;
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });

        if(e.target.value) {
            //console.log('start');
            socket.emit('START_TYPING', this.props.user.username, this.props.chat.id);
        }

        if(!e.target.value && this.state.message) {
            //console.log('stop');
            socket.emit('STOP_TYPING', this.props.user.username, this.props.chat.id);
        }
    };

    sendMessage(e) {
        e.preventDefault();

        if(this.state.message) {
            let message = {
                chat_id: this.props.chat.id,
                content: this.state.message
            };

            this.props.saveMessage(message);
            socket.emit('SEND_MESSAGE', message);
            socket.emit('STOP_TYPING', this.props.user.username, this.props.chat.id);

            this.setState({
                message: ''
            })
        }
    }

    render() {
        const messages = this.props.messages;
        const { name } = this.props.chat;

        let showMessages;
        if(messages) {
            showMessages = messages.map((message, index) => {
                let type;
                if(message.sender_id == this.props.user.id) {
                    type = "myMessage"
                } else {
                    type = "friendMessage"
                };
                return (
                    <li key={index} className={classnames("list-group-item",type)}>{message.content}</li>
                )
            });
        }

        let showTyping;
        if(this.state.typingUser) {
            showTyping = Object.keys(this.state.typingUser).map((username,index) => {
                if(this.state.typingUser[username]) {
                    return (
                        <li key={index} className="typing">{username} is typing...</li>
                    )
                } else return null;
            })
        }

        return (
            <div className="sass-ChatPanel">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">{name ? name : 'Chat'}</h3>
                    </div>
                </div>
                <div className="panel-body">
                    {!isEmpty(name) ?
                        <div className="chatDiv">
                            <div className="messages" ref="scroll">
                                <ul className="list-group">
                                    {showMessages}
                                </ul>
                            </div>
                            <div className="typePanel">
                                <div className="typeMessage">
                                    <form onSubmit={this.sendMessage}>
                                        <input autoComplete="off" value={this.state.message} name="message" type="text" placeholder="Type a message" onChange={this.onChange}/>
                                        <button type="submit">Send</button>
                                    </form>
                                </div>
                                <div className="typeUser">
                                    <ul className="list-group">
                                        {showTyping}
                                    </ul>
                                </div>
                            </div>
                        </div> : 'Click on friend and chat with him :)'}
                </div>
            </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.auth.user,
        messages: state.messages,
        chat: state.chat,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        saveMessage: (message) => dispatch(saveMessage(message)),
        pushMessage: (message) => dispatch(pushMessage(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPanel);