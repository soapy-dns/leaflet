import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Modal} from 'semantic-ui-react'

class RemoveFileModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { cancelAction, okAction } = this.props
        return (
            <Modal size='mini' open>
                <Modal.Header>Are ya sure?</Modal.Header>
                <Modal.Content>
                    <p>
                        This will remove the file from the map.
                    </p>
                    <p>
                        It will not delete the file from your file system
                    </p>
                    <p>
                        Any changes you have made to this file WILL be lost if not saved.
                    </p>

                    <Modal.Actions>
                        <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                        <Button type='submit' color="blue" onClick={okAction}>REMOVE FILE</Button>
                    </Modal.Actions>
                </Modal.Content>
            </Modal>
        )
    }
}

RemoveFileModal.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
}

export default RemoveFileModal
