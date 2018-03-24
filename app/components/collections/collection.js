import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import { DropTarget } from 'react-dnd'
import Constants from '../../common/constants'

const collectionTarget = {
    drop(props, monitor) {
        const featureName = monitor.getItem().featureName
        props.onMoveFeature(featureName, props.collectionName)
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



const Collection = (props) => {
    const icon = (props.collectionName === props.selectedCollectionName) ? 'folder open outline' : 'folder outline'

    return props.connectDropTarget(
            <span>
                {props.altered ? (
                    <Icon color="blue" size="large" name="save" onClick={(e) => props.saveCollection(props.collectionName)} />
                ) : null}

                <Icon color="blue" size="large" name={icon} />
                {props.collectionName}


            </span>

    )
}

Collection.propTypes = {
    collectionName: PropTypes.string,
    altered: PropTypes.boolean,
    selectedCollectionName: PropTypes.string,
    onMoveFeature: PropTypes.func,
    saveCollection: PropTypes.func,

    // injected by dnd
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
}

export default DropTarget(Constants.dragndrop.FEATURE, collectionTarget, collect)(Collection)

