import { isEmpty, remove } from 'lodash'
import {
    ADD_FILE,
    NEW_FILE,
    ADD_FEATURE_TO_FILE,
    UPDATE_FILES,
    UPDATE_FILE,
    UPDATE_WAYPOINT_POSITION,
    REMOVE_FILE,
    MARK_FILE_AS_ALTERED
} from '../actions/files'


const _getMatchingFile = (stateObj, fileId) => {
    return stateObj.find(it => it.id === fileId)
}

const _getMatchingFeatureById = (featureCollection, featureId) => {
    return featureCollection.features.find(feature => feature.properties.id === featureId)
}

export default function(fileState = [], action) {
    let newState
    let foundFile, foundFeature
    switch (action.type) {
        /*
        should we check for a file of the same name?
         */
        case ADD_FILE:
            newState = Object.assign([], fileState)
            newState.push({
                name: action.fileName,
                id: action.fileId,
                altered: false,
                featureCollection: action.fileText
            })

            return newState

        case NEW_FILE:
            // new file is being called from open file, and when adding a new waypoint - todo - fix it
            newState = Object.assign([], fileState)
            newState.push({
                name: action.fileName,
                altered: true,
                featureCollection: action.fileText
            })

            return newState

        case ADD_FEATURE_TO_FILE:
            newState = Object.assign([], fileState)

            foundFile = _getMatchingFile(newState, action.selectedFileId)

            // add the new feature to it
            foundFile.featureCollection.features.push(action.feature)
            foundFile.altered = true

            // return the state (which has been updated by the push)
            return newState

        case UPDATE_FILES:
            return action.files

        case UPDATE_FILE:
            newState = Object.assign([], fileState)
            console.log('action.file', action.file)

            const newFile = action.file
            newFile.altered = true

            console.log('files before remove', newState[0])
            remove(newState, it => it.id === action.file.id)
            console.log('files after remove', newState[0])

            newState.push(newFile)
            console.log('files after add', newState[0], newState[1])

            return newState

        case MARK_FILE_AS_ALTERED:
            newState = Object.assign([], fileState)

            foundFile = _getMatchingFile(newState, action.fileId)
            foundFile.altered = true

            return newState

        case REMOVE_FILE:
            newState = Object.assign([], fileState)
            remove(newState, it => it.id === action.fileId)

            return newState

        case UPDATE_WAYPOINT_POSITION:
        console.log('update waypoint position - reducer')
        debugger
            newState = Object.assign([], fileState)

            foundFile = _getMatchingFile(newState, action.fileId)
            foundFile.altered = true

            foundFeature = _getMatchingFeatureById(foundFile.featureCollection, action.pointId)
            foundFeature.geometry.coordinates = [action.latlng.lng, action.latlng.lat]

            return newState

        default:
            return fileState
    }
}

