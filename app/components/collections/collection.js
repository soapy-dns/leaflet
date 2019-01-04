import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Icon, Input } from 'semantic-ui-react'

import {DropTarget} from 'react-dnd'
import Constants from '../../common/constants'
import ChangeableField from './changeable-field'

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
        this.state = {
            edit: false
        }
        // this.handleClick = this.handleClick.bind(this)
        this.renderIcons = this.renderIcons.bind(this)
    }

    // handleClick(e) {
    //     // cancel previous callback
    //     console.log('handleClick')
    //     if (this.timeout) clearTimeout(this.timeout)

    //     // increment count
    //     this.count++

    //     // schedule new callback  [timeBetweenClicks] ms after last click
    //     this.timeout = setTimeout(() => {
    //         // listen for double clicks
    //         if (this.count === 2) {
    //             // turn on edit mode
    //             this.setState({
    //                 edit: true,
    //             })
    //         }

    //         // reset count
    //         this.count = 0
    //     }, 250) // 250 ms
    // }

    renderIcons() {
        console.log('renderIcons')
        const { fileId, altered, onSaveFile, fileName, selectedFileId } = this.props
        const icon = (fileId === selectedFileId) ? 'folder open outline' : 'folder outline'
        console.log('renderIcons', fileName)

        return (
            <span>
                {altered ? (
                    <Icon color="blue" size="large" name="save"
                        onClick={(e) => onSaveFile(fileName, fileId)} />
                    ) : <span>no icons</span>
                }
                <Icon color="blue" size="large" name={icon} />
            </span>
        )
    }


    // todo - have updateable field component so can re-use
    render() {
        const {fileId, fileName, selectedFileId} = this.props
        const { edit } = this.state
        console.log('render collection')

        return (
            <span>
                {this.renderIcons()}
                <ChangeableField value={fileName} />
            </span>
        )

        // if (edit) {
        //     return (
        //         <span>
        //             {this.renderIcons()}
        //             <span><Input name="collectionName"/></span>
        //         </span>

        //     )
        // } else {
        //     return this.props.connectDropTarget(
        //         <span onClick={this.handleClick}>
        //             {this.renderIcons()}

        //             {fileName}
        //         </span>
        //     )
        // }
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
