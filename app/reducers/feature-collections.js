import { NEW_FEATURE_COLLECTION, ADD_FEATURE_TO_COLLECTION, UPDATE_COLLECTIONS, UPDATE_WAYPOINT_POSITION } from '../actions/feature-collections'


const _getMatchingCollection = (stateObj, collectionName) => {
    return stateObj.find(it => it.name === collectionName)
}

const _getMatchingFeatureById = (featureCollection, featureId) => {
    return featureCollection.features.find(it => it.properties.name === action.featureId)

}

export default function (fcState = [], action) {
    let newState
    let foundCollection, foundFeature
    switch (action.type) {
        case NEW_FEATURE_COLLECTION:
            // todo - need to check for existing matching feature collection
            // coordinates.splice(i+1, 1)

            foundCollection = fcState.find(it => (it.name === action.filename))
            if (!foundCollection) {
                // add new collection
                fcState.push({
                    name: action.filename,
                    altered: false,
                    featureCollection: action.fcText
                })
            } else {
                // todo - should alert if collections has been change
                foundCollection.featureCollection = action.fcText
                foundCollection.altered = false
            }

            return fcState

        case ADD_FEATURE_TO_COLLECTION:
            newState = Object.assign([], fcState)

            const foundFeatureCollection = _getMatchingCollection(newState, action.selectedCollectionName)

            // add the new feature to it
            foundFeatureCollection.featureCollection.features.push(action.feature)
            foundFeatureCollection.altered = true

            // return the state (which has been updated by the push)
            return newState

        case UPDATE_COLLECTIONS:
            // console.log('reducer', action.collections)
            return action.collections

        case UPDATE_WAYPOINT_POSITION: {}
            console.log('UPDATE_WAYPOINT_POSITION action', action)
            // const newState = { ...fcState }  // todo - think I need to add something into babel
            newState = Object.assign([], fcState)
            //
            foundCollection = _getMatchingCollection(newState, action.collectionName)
            //
            foundFeature = _getMatchingFeatureById(foundFeatureCollection, action.waypointId)

            // foundFeature.

            return fcState

        default:
            return fcState
    }
}
