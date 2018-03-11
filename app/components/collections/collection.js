import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from 'semantic-ui-react'
import { DropTarget } from 'react-dnd'

const collectionTarget = {
    drop(props, monitor) {
        // might use monitor.getItem to retrieve the dragged item, but only have the one draggable thing
        // todo - do whatever you want on drop
        console.log('dropped')
        console.log('item', monitor.getItem())
        props.onMoveFeature()
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
            <Icon color="blue" size="large" name={icon} />
            {props.collectionName}
        </span>
    )
    // return (
    //     <span>
    //         <Icon color="blue" size="large" name={icon} />
    //         {props.collectionName}
    //     </span>
    // )
}

Collection.propTypes = {
    collectionName: PropTypes.string,
    selectedCollectionName: PropTypes.string,
    onMoveFeature: PropTypes.func,

    // injected by dnd
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
}

// function mapStateToProps(state) {
//     return {
//
//     }
// }

// export default Collection
// todo - move FEATURE to a constante
export default DropTarget('FEATURE', collectionTarget, collect)(Collection)

