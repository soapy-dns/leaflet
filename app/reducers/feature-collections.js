import { NEW_FEATURE_COLLECTION,  } from '../actions/feature-collections'

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

        default:
            return fcState
    }
}
