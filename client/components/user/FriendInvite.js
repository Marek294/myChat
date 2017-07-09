import React from 'react';
import { connect } from 'react-redux';

import { inviteFriend } from '../../actions/friendActions';

require("!style-loader!css-loader!sass-loader!../../sass/_FriendInvite.scss");

class FriendInvite extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            friendEmail: ''
        };

        this.invite = this.invite.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    invite(e) {
        e.preventDefault();
        this.props.inviteFriend(this.state);
    }

    render() {
        return (
            <div className="sass-FriendInvite">
                <div className="panel panel-info">
                    <div className="panel-heading">
                        <div className="flashHeader">
                            <h3 className="panel-title">Invite a Friend</h3>
                        </div>
                    </div>
                    <div className="panel-body">
                        <form className="form-inline inviteForm" onSubmit={this.invite}>
                            <div className="form-group">
                                <input name="friendEmail" type="email" className="form-control" placeholder="Email Address" onChange={this.onChange} />
                            </div>
                            <button type="submit" className="inviteButton">Send Friend Request</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps (dispatch) {
    return {
        inviteFriend: (friendEmail) => dispatch(inviteFriend(friendEmail)),
    }
}

export default connect(null, mapDispatchToProps)(FriendInvite);