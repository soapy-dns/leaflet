import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Icon, Button, Progress, Message } from 'semantic-ui-react';

// import Api from '../../helpers/api';

class Uploader extends Component {

    constructor(props) {
        super(props);
        console.log('TrackUploader constructor')
        this.state = {
            // uploaded: false,
        //     uploading: false,
            files: [],
        //     expectedBytes: 0,
        //     progressPercent: 0,
            success: null,
            error: null
        };
        this.uploadFiles = this.uploadFiles.bind(this);
        // this.onDocumentUpload = this.onDocumentUpload.bind(this);
        this.gallery = this.gallery.bind(this);
        this.getCaption = this.getCaption.bind(this);
        // this.onProgress = this.onProgress.bind(this);
        // this.reset = this.reset.bind(this);
    }

    getCaption(caption) {
        return (
            <span className="caption">
                {caption}
            </span>
        );
    }

    gallery() {
        if (!this.state.file) return null;
        const caption = this.getCaption(this.state.file.name);

        return (
            <div>
                <Icon name="file outline" color="blue" size="large" />{caption}
            </div>
        );
    }

    uploadFiles(event) {
        const maxFileSize = '1000000';  // max size 1MB - probably make this smaller
        const maxFileSizeError = 'Each file must be smaller than 1 MB';
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
        // if (uploadedFiles[0].type !== validFileType) {
        //     this.setState({ error: validFileTypeError });
        //     return;
        // }
        this.setState({ file: uploadedFiles[0], expectedBytes: uploadedFiles[0].size, success: null, error: null });
        // track.features[0].geometry

        // read file into memory
        const reader = new FileReader();
        reader.onload = (subEvent) => {
            this.props.onUploaded(subEvent.target.result);
        }
        reader.readAsText(uploadedFiles[0])
    }

    render() {
        const { accept } = this.props
        console.log('accept', accept)
        return (<div>
         <div>
             {this.gallery()}
         </div>
            {!this.state.file ?
             (
                 <input type="file" name="upload" onChange={this.uploadFiles} accept={accept} width="50" />
             ) : null
         }
        </div>)
    }
}

Uploader.defaultProps = {
    accept: '*',
};

Uploader.propTypes = {
    accept: PropTypes.string,
    onUploaded: PropTypes.func
};

export default Uploader


