export const getLineStyle = (color) => {
    return function (feature) {
        return {
            color: color || 'red',
            weight: 3,
        }
    }
}

export const trackOnMouseOver = function (feature, layer) {
    if (feature.geometry.type === 'LineString') {
        layer.on('mouseover', function () {
            this.setStyle({
                weight: 5
            })
        })
        layer.on('mouseout', function () {
            trackLayerGroup.resetStyle(this)
        })
        layer.on('click', function () {
            console.log('select')
            layer.off(mouseout, mouseout())
            dispatch(selectTrack(track))
            this.setStyle({
                weight: 5,
                dashArray: '5, 10, 7, 10, 10, 10'
            })
        })
    }
}
