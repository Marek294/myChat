import React from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashActions';

export default function(ComposedComponent) {
    class Authenticate extends React.Component {
        componentWillMount() {
            if(!this.props.isAuthenticated) {
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'You need log in to access this page'
                });
                this.context.router.push('/login');
            }
        }

        componentWillUpdate(nextProps) {
            if(!nextProps.isAuthenticated) {
                this.context.router.push('/login');
            };
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    Authenticate.contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated
        }
    }

    return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}