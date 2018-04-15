import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Modal} from 'semantic-ui-react'

class RemoveFeatureModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log('render RemoveFeatureModal')
        const { cancelAction, okAction } = this.props
        return (
            <Modal size='mini' open>
                <Modal.Header>Are ya sure?</Modal.Header>
                <Modal.Content>
                    <p>
                        This will remove the feature from the file.
                    </p>
                    <p>
                        You will not be able to recover it!
                    </p>

                    <Modal.Actions>
                        <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                        <Button type='submit' color="blue" onClick={okAction}>REMOVE FEATURE</Button>
                    </Modal.Actions>
                </Modal.Content>
            </Modal>
        )
    }
}

RemoveFeatureModal.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
}

export default RemoveFeatureModal
