
const options = {
    // makes the layer draggable
    draggable: true,

    // makes the vertices snappable to other layers
    // temporarily disable snapping during drag by pressing ALT
    snappable: true,

    // distance in pixels that needs to be undercut to trigger snapping
    // default: 30
    snapDistance: 30,

    // self intersection allowed?
    allowSelfIntersection: true,

    // disable the removal of markers/vertexes via right click
    preventMarkerRemoval: false,

    // disable the possibility to edit vertexes
    preventVertexEdit: false,
}

export default options