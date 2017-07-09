import React from 'react';
import { connect } from 'react-redux';

import { userLoginRequest } from '../actions/userActions';

require("!style-loader!css-loader!sass-loader!../sass/_Forms.scss");

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.userLoginRequest(this.state).then(() => {
            this.context.router.push('/user');
        }, (err) => {
            this.setState({
                errors: err.response.data.errors
            });
        })
    }

    render() {
        return (
            <div className="sass-Forms">
            <div className="signupContainer">
                <h2 className="text-center">Log In</h2>
                {this.state.errors.form && <div className="alert alert-danger">{this.state.errors.form}</div> }
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Username</label>
                        <div className="col-sm-10">
                            <input name="username" type="text" className="form-control" placeholder="Username" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Password</label>
                        <div className="col-sm-10">
                            <input name="password" type="password" className="form-control" placeholder="Password" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="borderTransition">
                                <button type="submit" >Log in</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function mapDispatchToProps (dispatch) {
    return {
        userLoginRequest: (userData) => dispatch(userLoginRequest(userData)),
    }
}

export default connect(null, mapDispatchToProps)(Login);