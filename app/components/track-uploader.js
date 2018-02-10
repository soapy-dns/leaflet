import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Icon, Button, Progress, Input, Message } from 'semantic-ui-react';

// import Api from '../../helpers/api';

class TrackUploader extends Component {

    constructor(props) {
        super(props);
        console.log('TrackUploader constructor')
        this.state = {
            uploading: false,
            files: [],
            expectedBytes: 0,
            progressPercent: 0,
            success: null,
            error: null
        };
        this.uploadFiles = this.uploadFiles.bind(this);
        this.onDocumentUpload = this.onDocumentUpload.bind(this);
        this.gallery = this.gallery.bind(this);
        this.getCaption = this.getCaption.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.reset = this.reset.bind(this);
    }

    onProgress(bytesLoaded) {
        this.setState({ progressPercent: (bytesLoaded * 100) / this.state.expectedBytes });
    }

    onDocumentUpload() {
        console.log('onDocumentUpload')
        this.setState({ uploading: true });
    }


    getCaption(caption) {
        return (
            <div className="caption">
                {caption}
            </div>
        );
    }

    reset() {
        this.setState({ uploading: false, expectedBytes: 0, progressPercent: 0, file: null });
    }

    uploadFiles(event) {
        const maxFileSize = '50000000';
        const maxFileSizeError = 'Each file must be smaller than 50 MB';
        const maxFiles = 1;
        const maxFilesError = 'Can only upload one file at a time';
        const validFileType = 'text/csv';
        const validFileTypeError = 'Can only upload csv files';
        const uploadedFiles = event.target.files;

        if (uploadedFiles.length > maxFiles) {
            this.setState({ error: maxFilesError });
            return;
        }
        if (uploadedFiles[0].size > maxFileSize) {
            this.setState({ error: maxFileSizeError });
            return;
        }
        if (uploadedFiles[0].type !== validFileType) {
            this.setState({ error: validFileTypeError });
            return;
        }
        this.setState({ file: uploadedFiles[0], expectedBytes: uploadedFiles[0].size, success: null, error: null });
    }

    gallery() {
        if (!this.state.file) return null;
        const caption = this.getCaption(this.state.file.name);

        return (
            <div>
                <Icon name="file outline" color="teal" size="huge" />
                {caption}
            </div>
        );
    }

    render() {
        // const { accept } = this.props;
        // console.log('props', this.props)
        return (<div>TrackUploader</div>)

    }
}

export default TrackUploader;
