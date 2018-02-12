import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button } from 'semantic-ui-react';

class AwaitingFunctionality extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { cancelAction } = this.props
        return (
            <Modal size='mini' open>
                <Modal.Header>Sorry</Modal.Header>
                <Modal.Content>
                    This functionality is not yet available.
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


AwaitingFunctionality.propTypes = {
    cancelAction: PropTypes.func
};

export default AwaitingFunctionality;

