import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import { fromLatLon } from 'utm'
import utils from '../../common/utils'
// const utm = require('utm')



import isEmpty from '../../utils/is-empty'

//02 47600 62 63400
class OnSaveFileModal extends Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            filename: null,
            fileType: null,
            errors: {}
        }
    }

    componentDidMount() {
        const { selectedFileIdToSave, files } = this.props
        console.log('onSaveFile - selectedFileIdToSave', selectedFileIdToSave)

        const file = utils.getFileById(files, selectedFileIdToSave)
        const fileFullName = file.name
        const parts = fileFullName.split('.')

        this.setState({ fileName: parts[0], fileType: parts[1] })
    }

    onChange(event) {
        const name = event.target.name
        this.setState( { [name]: event.target.value })
    }

    validate() {
        console.log('validate')
        const errors = {}
        const { fileName, fileType } = this.state
        console.log('state-', this.state)
        if (!fileName) errors.fileName = 'Please enter a name for the file'
        console.log('fileName', fileName, fileName.indexOf('.'))
        if (fileName.indexOf('.') > -1) errors.fileName = 'File name must not include "."'
        if (!['gpx', 'json', 'geojson'].includes(fileType)) errors.fileType = 'Invalid field type'

        return errors
    }

    onSubmit(event) {
        console.log('onSubmit')
        const { fileName, fileType } = this.state
        event.preventDefault()  // todo - check if still need this
        const errors = this.validate()
        console.log('validation errors', errors)

        const { okAction } = this.props

        const formData = {
            fileFullName: fileName.concat(fileType),
        }
        // validate
        console.log('onSubmit - okAction', okAction)
        console.log('locate errors?', errors)
        if (isEmpty(errors)) okAction(formData)
        this.setState({ errors: errors })
    }

    render() {
        const { cancelAction } = this.props
        const { errors, fileName, fileType } = this.state
        return (
            <Modal size='mini' open>
                <Modal.Header>Save File</Modal.Header>
                <Modal.Content>
                    <Form size="tiny" onSubmit={this.onSubmit} error>
                        <Form.Field>
                            <Form.Input label="File Name" name="fileName" placeholder='File name' onChange={this.onChange} error={!!errors.fileName} value={fileName} />
                            {!!errors.fileName ? (
                                <div className="error">{errors.fileName}</div>
                            ) : null}
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="File Type" name="fileType" placeholder='file type' onChange={this.onChange} error={!!errors.fileType} value={fileType} />
                            {!!errors.fileType ? (
                                <div className="error">{errors.fileType}</div>
                            ) : null}
                        </Form.Field>

                        <Modal.Actions>
                            <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                            <Button type='submit' color="blue">SAVE</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


OnSaveFileModal.propTypes = {
    // heading: PropTypes.string,
    // content: PropTypes.string,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
    selectedFileIdToSave: PropTypes.string,
    files: PropTypes.array // TODO - IS THIS TOO MUCH CRAP TO PUSH THRU?
    // selectedLatitude: PropTypes.number,
    // selectedLongitude: PropTypes.number

}

export default OnSaveFileModal

