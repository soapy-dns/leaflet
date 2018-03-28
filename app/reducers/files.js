import { isEmpty } from 'lodash'
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
            console.log('new file', action)
            // todo - need to check for existing matching feature collection
            newState = Object.assign([], fileState)
            console.log('newState', newState)

            // todo - need input for file altered or not.  A newly opened file will be unaltered
            // A new file as a result of a waypoint being added will be altered
            if (isEmpty(newState)) {
                // add new collection
                newState.push({
                    name: action.fileName,
                    altered: true,
                    featureCollection: action.fileText
                })
            } else {
                foundFile = newState.find(file => (file.name === action.fileName))
                if (!foundFile) {
                    // add new collection
                    newState.push({
                        name: action.fileName,
                        altered: true,
                        featureCollection: action.fileText
                    })
                } else {
                    foundFile.featureCollection = action.fileText
                    foundFile.altered = true
                }
            }

            return newState

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
          newState = Object.assign([], fileState)

            foundFile = _getMatchingFile(newState, action.fileName)
            foundFile.altered = true

            foundFeature = _getMatchingFeatureById(foundFile.featureCollection, action.pointId)
            foundFeature.geometry.coordinates = [action.latlng.lng, action.latlng.lat]

            return newState

        default:
            return fileState
    }
}
