import { NEW_FEATURE_COLLECTION, ADD_FEATURE_TO_COLLECTION, UPDATE_COLLECTIONS } from '../actions/feature-collections'

export default function (fcState = [], action) {
    switch (action.type) {
        case NEW_FEATURE_COLLECTION:
            // todo - need to check for existing matching feature collection
            // coordinates.splice(i+1, 1)

            const foundCollection = fcState.find(it => (it.name === action.filename))
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
            const newState = Object.assign([], fcState)

            // find the relevant feature collection
            const foundFeatureCollection = newState.find(it => it.name === action.selectedCollectionName)

            // add the new feature to it
            foundFeatureCollection.featureCollection.features.push(action.feature)
            foundFeatureCollection.altered = true

            // return the state (which has been updated by the push)
            return newState

        case UPDATE_COLLECTIONS:
            console.log('reducer', action.collections)
            return action.collections

        default:
            return fcState
    }
}
