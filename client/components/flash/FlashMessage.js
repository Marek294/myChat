import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { deleteFlashMessage } from '../../actions/flashActions';

require("!style-loader!css-loader!sass-loader!../../sass/_FlashMessage.scss");

class FlashMessage extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.deleteFlashMessage();
    }

    render() {
        const type = this.props.message.type;
        const text = this.props.message.text;

        let messageType;
        if(type === 'success') messageType = 'panel-success';
        else if(type === 'error' ) messageType = 'panel-danger';
        else messageType = 'panel-warning';

        return (
            <div className="sass-FlashMessage">
                {text ? <div className={classnames('panel', messageType)}>
                        <div className="panel-heading">
                            <div className="flashHeader">
                                <h3 className="panel-title">{type}</h3>
                                <button className="close" onClick={this.onClick}><span>&times;</span></button>
                            </div>
                        </div>
                        <div className="panel-body">
                            {text}
                        </div>
                    </div> : null}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        message: state.flash
    }
}

function mapDispatchToProps (dispatch) {
    return {
        deleteFlashMessage: () => dispatch(deleteFlashMessage()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);