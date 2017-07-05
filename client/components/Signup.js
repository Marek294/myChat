import React from 'react';
import { connect } from 'react-redux';

import { userSignupRequest, login } from '../actions/userActions';
import { addFlashMessage } from '../actions/flashActions';

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
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

        this.props.userSignupRequest(this.state).then(res => {
            this.props.addFlashMessage({
                type: 'success',
                text: 'You signed up succesfully. Welcome!'
            });

            this.props.login(res.data.token);
            this.context.router.push('/user');
        }, (err) => {
            this.setState({ errors: err.response.data.errors });

            if(err.response.data.errors.constraint == 'users_username_unique') {
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'There is a user with such username!'
                });
            } else if(err.response.data.errors.constraint == 'users_email_unique') {
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'There is a user with such email!'
                });
            }
        })
    }

    render() {
        return (
            <div className="signupContainer">
                <h2 className="text-center">Sign Up</h2>
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Username</label>
                        <div className="col-sm-10">
                            <input name="username" type="text" className="form-control" placeholder="Username" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Email</label>
                        <div className="col-sm-10">
                            <input name="email" type="email" className="form-control" placeholder="Email" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Password</label>
                        <div className="col-sm-10">
                            <input name="password" type="password" className="form-control" placeholder="Password" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Confirm Password</label>
                        <div className="col-sm-10">
                            <input name="confirmPassword" type="password" className="form-control" placeholder="Confirm Password" onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="borderTransition">
                                <button type="submit">Sign in</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Signup.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function mapDispatchToProps (dispatch) {
    return {
        userSignupRequest: (userData) => dispatch(userSignupRequest(userData)),
        login: (token) => dispatch(login(token)),
        addFlashMessage: (message) => dispatch(addFlashMessage(message)),
    }
}

export default connect(null, mapDispatchToProps)(Signup);