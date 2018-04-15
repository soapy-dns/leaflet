import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DragSource} from 'react-dnd'

import Point from './point-feature'
import LineString from './line-string-feature'
import Constants from '../../common/constants'

class Feature extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {featureType, featureName, isDragging, connectDragSource} = this.props

        let html
        if (featureType === 'Point') {
            html = (
                <Point featureName={featureName}/>
            )
        } else if (featureType == 'LineString') {
            html = (<LineString featureName={featureName}/>)  // todo - change styling on draggin object
        }

        return connectDragSource(
            <span
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    color: isDragging? "red": null
                }}
            >
                {html}
            </span>
        )
    }
}

/**
 * Implements the drag source contract.
 * Returns an object which identifies the item being dragged
 */
const featureSource = {
    beginDrag(props) {
        return {
            featureName: props.featureName,
            // collectionName: props.collectionName
        }
    }
}

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

Feature.propTypes = {
    featureType: PropTypes.string,
    featureName: PropTypes.string,
    onRemoveFeature: PropTypes.func,

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
}

export default DragSource(Constants.dragndrop.FEATURE, featureSource, collect)(Feature)
