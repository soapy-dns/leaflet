import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'

import Uploader from './uploader'

class LoadFileModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            uploaded: false
        }

        this.onChange = this.onChange.bind(this)
        // this.onSubmit = this.onSubmit.bind(this)
        this.onUploaded = this.onUploaded.bind(this)
    }

    /*
     performs the ok action on file upload.  No need for submit.  todo - remove submit, or allow changes
     */
    onUploaded (fileText, fileDetails) {
        console.log('onUploaded')
        this.setState({ uploaded: true })

        this.props.okAction(fileText, fileDetails)
    }

    onChange (event) {
        const name = event.target.name
        this.setState({ [name]: event.target.value })
    }

    // onSubmit(event) {
    //     // event.preventDefault()  // todo - check if still need this
    //     console.log('onSubmit', this.state)
    //
    //     const {okAction} = this.props
    //     this.props.okAction(fileText)
    //
    // }

    render () {
        const { cancelAction } = this.props
        console.log('load-file-modal')
        return (
            <Modal size='small' open>
                <Modal.Header>Upload your track</Modal.Header>
                <Modal.Content>
                    <p>.geojson, .gpx and .kml formats are supported</p>
                    <div><Uploader onUploaded={this.onUploaded} accept=".kml,.gpx,.geojson"/></div>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
LoadFileModal.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
}
export default LoadFileModal
