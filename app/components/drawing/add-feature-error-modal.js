import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Modal} from 'semantic-ui-react'

class AddFeatureErrorModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log('render add feature modal')
        const { cancelAction, okAction } = this.props
        return (
            <Modal size='mini' open>
                <Modal.Header>FAIL!!</Modal.Header>
                <Modal.Content>
                    <p>
                        At some point will allow the file to be selected, but at the moment you can only add to the current file or cancel.
                    </p>
                    <p>
                        If you want to add to a new file, create that file first
                    </p>
                    <p>
                        If you want to add to a different file, select that file then select the feature you want to add
                    </p>
                    <Modal.Actions>
                        <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                    </Modal.Actions>
                </Modal.Content>
            </Modal>
        )
    }
}

AddFeatureErrorModal.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
}

export default AddFeatureErrorModal
