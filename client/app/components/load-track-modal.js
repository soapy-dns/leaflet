import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Header, Modal, Button} from 'semantic-ui-react';

class LoadTrackModal extends Component {
    constructor(props) {
        console.log('--props', props)
        super(props)
        // this.onClick = this.onClick.bind(this)
        this.state = {
            open: true
        }
    }

    componentDidMount() {
        console.log('load track component did mount')
    }

    render() {
        console.log('render load track')
        const {cancelAction, okAction} = this.props

        return (
            <div>
                here
                <Modal basic size='large' open>
                    <Modal.Header>Load a new track</Modal.Header>
                    <Modal.Content>
                        <p>Select track file, geoJSON, KML, or GPX</p>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                        <Button color="blue" onClick={okAction}>LOAD TRACK</Button>
                    </Modal.Actions>
                </Modal>
            </div>

        )
    }
}


LoadTrackModal.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
};

export default LoadTrackModal;
