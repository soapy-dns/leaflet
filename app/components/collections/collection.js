import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Icon, Input } from 'semantic-ui-react'

import {DropTarget} from 'react-dnd'
import Constants from '../../common/constants'
import DoubleClickString from './doubleclick-field'

const collectionTarget = {
    drop(props, monitor) {
        const featureName = monitor.getItem().featureName
        props.onMoveFeature(featureName, props.fileId)
    }
}

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}
/**
 * A file
 */
class Collection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false
        }
        // this.handleClick = this.handleClick.bind(this)
        this.renderIcons = this.renderIcons.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onSaveFile = this.onSaveFile.bind(this)
    }

    /**
     * 'Save' and 'Open' file icons before the text
     */
    renderIcons() {
        const { fileId, altered, fileName, selectedFileId } = this.props
        const icon = (fileId === selectedFileId) ? 'folder open outline' : 'folder outline'

        return (
            <span>
                {altered ? (
                    <Icon color="blue" size="large" name="save"
                        onClick={(e) => this.onSaveFile(fileId)} />
                    ) : null
                }
                <Icon color="blue" size="large" name={icon} />
            </span>
        )
    }

    // /**
    //  * Change the file name
    //  * @deprecated
    //  * @param {*} newFileName
    //  */
    onSaveFile() {
        console.log('collection - onSaveFile')
        this.props.onSaveFile()
        // const { fileId, fileName, updateFileName } = this.props

        // if (newFileName !== fileName) updateFileName(newFileName, fileId)
    }
    onSelect() {
        const { onUpdateFileDetails } = this.props
        console.log('collection - onSelect')
        onUpdateFileDetails()
    }


    render() {
        const { fileName } = this.props
        console.log('fileName ', fileName )

        return (
            <span>
                {this.renderIcons()}
                <DoubleClickString value={fileName} onSelect={this.onSelect} />
            </span>
        )
    }
}

Collection.propTypes = {
    fileId: PropTypes.string,
    fileName: PropTypes.string,
    altered: PropTypes.boolean,
    // selectedFileId: PropTypes.string,
    onMoveFeature: PropTypes.func,
    onSaveFile: PropTypes.func.isRequired, // what to do on save
    onRemoveFile: PropTypes.func.isRequired, // what to do on remove file
    // updateFileName: PropTypes.func.isRequired,
    onUpdateFileDetails: PropTypes.func.isRequired,

    // injected by dnd
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
}

export default DropTarget(Constants.dragndrop.FEATURE, collectionTarget, collect)(Collection)
