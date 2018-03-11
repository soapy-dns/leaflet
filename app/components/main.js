import React from 'react'
import PropTypes from 'prop-types'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const Main = props => (
    <div>
        {props.children}
    </div>
)

Main.propTypes = {
    children: PropTypes.object.isRequired
}

// export default Main
export default DragDropContext(HTML5Backend)(Main)




