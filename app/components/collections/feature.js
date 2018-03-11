import React,  { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'

import Point from './point-feature'
import LineString from './line-string-feature'

class Feature extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { featureType, featureName, isDragging, connectDragSource } = this.props

        // console.log('isDragging', isDragging)
        // console.log('connectDragSource>>', props.connectDragSource)
        let html
        if (featureType === 'Point') {
            html = (
                    <Point featureName={featureName} />
            )
        } else if (featureType == 'LineString') {
            html = (<LineString featureName={featureName} />)  // todo - change styling on draggin object
        }

        return connectDragSource(
            <div
                style={{
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                {html}
            </div>
        );
    }
}

/**
 * Implements the drag source contract.
 * Returns an object which identifies the item being dragged
 */
const featureSource = {
    beginDrag(props) {
        return {
            featureName: 'x',
            collectionName: 'y'
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

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
    // isDragging: PropTypes.bool,
    // connectDragSource: PropTypes.func
}
// console.log('ds>>', DragSource('FEATURE', featureSource, collect))
// Export the wrapped component:
export default DragSource('FEATURE', featureSource, collect)(Feature)
