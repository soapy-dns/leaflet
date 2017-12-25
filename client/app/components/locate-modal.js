import React from 'react';
import PropTypes from 'prop-types';

import { Header, Modal, Button } from 'semantic-ui-react';

const LocateModal = (props) => (
    <Modal basic size='large'>
        <Header>Load a new track</Header>
        <Modal.Content>
            <p>Select track file, geoJSON, KML, or GPX</p>
        </Modal.Content>

        <Modal.Actions>
            <Button basic color="blue" onClick={props.cancelAction}>CANCEL</Button>
            <Button color="blue" onClick={props.okAction}>LOCATE</Button>
        </Modal.Actions>
    </Modal>

);

LocateModal.propTypes = {
    // heading: PropTypes.string,
    // content: PropTypes.string,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
};

export default LocateModal;
