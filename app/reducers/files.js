import { NEW_FILE, ADD_FEATURE_TO_FILE, UPDATE_FILES, UPDATE_WAYPOINT_POSITION } from '../actions/files'


const _getMatchingCollection = (stateObj, collectionName) => {
    return stateObj.find(it => it.name === collectionName)
}

const _getMatchingFeatureById = (featureCollection, featureId) => {
    return featureCollection.features.find(it => it.properties.name === action.featureId)

}

export default function (fileState = [], action) {
    let newState
    let foundCollection, foundFeature
    switch (action.type) {
        case NEW_FILE:
            // todo - need to check for existing matching feature collection
            // coordinates.splice(i+1, 1)

            foundCollection = fileState.find(it => (it.name === action.filename))
            if (!foundCollection) {
                // add new collection
                fileState.push({
                    name: action.filename,
                    altered: false,
                    featureCollection: action.fileText
                })
            } else {
                // todo - should alert if collections has been change
                foundCollection.featureCollection = action.fileText
                foundCollection.altered = false
            }

            return fileState

        case ADD_FEATURE_TO_FILE:
            newState = Object.assign([], fileState)

            const foundFeatureCollection = _getMatchingCollection(newState, action.selectedFileName)

            // add the new feature to it
            foundFeatureCollection.featureCollection.features.push(action.feature)
            foundFeatureCollection.altered = true

            // return the state (which has been updated by the push)
            return newState

        case UPDATE_FILES:
            // console.log('reducer', action.collections)
            return action.collections

        case UPDATE_WAYPOINT_POSITION: {}
            console.log('UPDATE_WAYPOINT_POSITION action', action)
            // const newState = { ...fileState }  // todo - think I need to add something into babel
            newState = Object.assign([], fileState)
            //
            // foundCollection = _getMatchingCollection(newState, action.collectionName)
            //
            newState.featureCollections.forEach(it => {

            })
            foundFeature = _getMatchingFeatureById(foundFeatureCollection, action.waypointId)

            // foundFeature.

            return fileState

        default:
            return fileState
    }
}
