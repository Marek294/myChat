import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import socket from '../../socket';
import isEmpty from 'lodash/isEmpty';

import { saveMessage } from '../../actions/chatActions';

require("!style-loader!css-loader!sass-loader!../../sass/_ChatPanel.scss");

class ChatPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };

        this.onChange = this.onChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        socket.on('SERVER_SEND_MESSAGE', (message) => {
            if(this.props.chat.friend) {
                if (this.props.chat.friend.id == message.userId) {
                    this.props.saveMessage(message);
                }
            }
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
    };

    sendMessage(e) {
        e.preventDefault();

        if(this.state.message) {
            let message = {
                userId: this.props.user.id,
                text: this.state.message
            };

            this.props.saveMessage(message);

            socket.emit('SEND_MESSAGE', message, this.props.chat.friend);

            this.setState({
                message: ''
            })
        }
    }

    render() {
        const { friend, messages } = this.props.chat;

        let showMessages;
        if(messages) {
            showMessages = messages.map((message, index) => {
                let type;
                if(message.userId == this.props.user.id) {
                    type = "myMessage"
                } else {
                    type = "friendMessage"
                };
                return (
                    <li key={index} className={classnames("list-group-item",type)}>{message.text}</li>
                )
            });
        }

        return (
            <div className="sass-ChatPanel">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="flashHeader">
                        <h3 className="panel-title">{friend ? friend.username : 'Chat'}</h3>
                    </div>
                </div>
                <div className="panel-body">
                    {!isEmpty(friend) ?
                        <div className="chatDiv">
                            <div className="messages" ref="scroll">
                                <ul className="list-group">
                                    {showMessages}
                                </ul>
                            </div>
                            <div className="typeMessage">
                                <form onSubmit={this.sendMessage}>
                                    <input autoComplete="off" value={this.state.message} name="message" type="text" placeholder="Type a message" onChange={this.onChange}/>
                                    <button type="submit">Send</button>
                                </form>
                            </div>
                        </div>: 'Click on friend and chat with him :)'}
                </div>
            </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.auth.user,
        chat: state.chat,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        saveMessage: (message) => dispatch(saveMessage(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPanel);