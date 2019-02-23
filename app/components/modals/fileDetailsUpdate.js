import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import { fromLatLon } from 'utm'
import utils from '../../common/utils'
// const utm = require('utm')



import isEmpty from '../../utils/is-empty'

//02 47600 62 63400
class FileDetailsUpdate extends Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            fileName: null,
            fileType: null,
            errors: {}
        }
    }

    componentDidMount() {
        const { selectedFileId, files } = this.props

        const file = utils.getFileById(files, selectedFileId)
        this.setState({ fileName: file.name, fileType: file.type })
    }

    onChange(event) {
        const name = event.target.name
        this.setState( { [name]: event.target.value })
    }

    validate() {
        const errors = {}
        const { fileName, fileType } = this.state
        if (!fileName) errors.fileName = 'Please enter a name for the file'
        if (fileName.indexOf('.') > -1) errors.fileName = 'File name must not include "."'
        if (!['gpx', 'json', 'geojson'].includes(fileType)) errors.fileType = 'Invalid field type'

        return errors
    }

    onSubmit(event) {
        const { fileName, fileType } = this.state
        const { selectedFileId } = this.props
        event.preventDefault()  // todo - check if still need this
        const errors = this.validate()

        const { okAction } = this.props

        const formData = {
            fileName: fileName,
            fileType: fileType
        }

        if (isEmpty(errors)) okAction(selectedFileId, formData)
        this.setState({ errors: errors })
    }

    render() {
        const { cancelAction } = this.props
        const { errors, fileName, fileType } = this.state
        return (
            <Modal size='mini' open>
                <Modal.Header>Update File Details</Modal.Header>
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
                            <Button type='submit' color="blue">UPDATE</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


FileDetailsUpdate.propTypes = {
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
    selectedFileId: PropTypes.string,
    files: PropTypes.array // TODO - IS THIS TOO MUCH CRAP TO PUSH THRU?

}

export default FileDetailsUpdate

