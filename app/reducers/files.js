import { NEW_FILE, ADD_FEATURE_TO_FILE, UPDATE_FILES, UPDATE_WAYPOINT_POSITION } from '../actions/files'


const _getMatchingFile = (stateObj, fileName) => {
    return stateObj.find(it => it.name === fileName)
}

const _getMatchingFeatureById = (featureCollection, featureId) => {
    console.log('featureCollection %j', featureCollection.features, featureId)
    return featureCollection.features.find(feature => feature.properties.id === featureId)

}

export default function (fileState = [], action) {
    let newState
    let foundFile, foundFeature
    switch (action.type) {
        case NEW_FILE:
            // todo - need to check for existing matching feature collection
            // coordinates.splice(i+1, 1)

            foundFile = fileState.find(it => (it.name === action.filename))
            if (!foundFile) {
                // add new collection
                fileState.push({
                    name: action.filename,
                    altered: false,
                    featureCollection: action.fileText
                })
            } else {
                // todo - should alert if collections has been change
                foundFile.featureCollection = action.fileText
                foundFile.altered = false
            }

            return fileState

        case ADD_FEATURE_TO_FILE:
            newState = Object.assign([], fileState)

            foundFile = _getMatchingFile(newState, action.selectedFileName)

            // add the new feature to it
            foundFile.featureCollection.features.push(action.feature)
            foundFile.altered = true

            // return the state (which has been updated by the push)
            return newState

        case UPDATE_FILES:
            // console.log('reducer', action.collections)
            return action.collections

        case UPDATE_WAYPOINT_POSITION: {}
            // console.log('UPDATE_WAYPOINT_POSITION action', action)
            // const newState = { ...fileState }  // todo - think I need to add something into babel
            newState = Object.assign([], fileState)
            //
            foundFile = _getMatchingFile(newState, action.fileName)
            foundFile.altered = true

            foundFeature = _getMatchingFeatureById(foundFile.featureCollection, action.pointId)

            // console.log('foundFeature', foundFeature)
            // console.log('latlng', action.latlng)
            // const coords = [action.latlng.lng, action.latlng.lat]
            // console.log('coords', coords)
            foundFeature.geometry.coordinates = [action.latlng.lng, action.latlng.lat]

            return newState

        default:
            return fileState
    }
}
