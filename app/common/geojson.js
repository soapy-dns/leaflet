export const waypointFeature = (latlng) => {
    return {
        "type": "Feature",
        "properties": {
            "name": "",
            "time": ""
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                e.latlng.lng,
                e.latlng.lat,
                null
            ]
        }
    }
}
