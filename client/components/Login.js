import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="signupContainer">
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Username</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">Log in</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;