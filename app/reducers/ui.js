import { TOGGLE_ELEVATION, SELECT_COLLECTION, SELECT_LATLNG, CLEAR_LATLNG } from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = {}

export default function (uiState = defaultState, action) {
    switch (action.type) {
        case TOGGLE_ELEVATION:
            return merge(uiState, { showElevation: action.boolean })
        case SELECT_COLLECTION:
            return merge(uiState, { selectedCollectionName: action.selectedCollectionName})
        case SELECT_LATLNG:
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        case CLEAR_LATLNG:
            console.log('reducer', action)
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        default:
            return uiState
    }
}
