import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Icon} from 'semantic-ui-react'

import {DropTarget} from 'react-dnd'
import Constants from '../../common/constants'

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

class Collection extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {fileId, fileName, selectedFileId, altered, onSaveFile} = this.props
        const icon = (fileId === selectedFileId) ? 'folder open outline' : 'folder outline'

        return this.props.connectDropTarget(
            <span>
                    {altered ? (
                        <Icon color="blue" size="large" name="save"
                              onClick={(e) => onSaveFile(fileName, fileId)}/>
                    ) : null}

                <Icon color="blue" size="large" name={icon}/>
                {fileName}
            </span>
        )
    }
}

Collection.propTypes = {
    fileId: PropTypes.string,
    fileName: PropTypes.string,
    altered: PropTypes.boolean,
    selectedFileId: PropTypes.string,
    onMoveFeature: PropTypes.func,
    saveFile: PropTypes.func,
    onRemoveFile: PropTypes.func,

    // injected by dnd
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
}

export default DropTarget(Constants.dragndrop.FEATURE, collectionTarget, collect)(Collection)
