import { TOGGLE_ELEVATION, SELECT_COLLECTION, SELECT_LATLNG, CLEAR_LATLNG, TOGGLE_COLLECTION_SLIDER } from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = { showCollectionSlider: false }

export default function (uiState = defaultState, action) {
    switch (action.type) {
        case TOGGLE_ELEVATION:
            return merge(uiState, { showElevation: action.boolean })
        case SELECT_COLLECTION:
            return merge(uiState, { selectedCollectionName: action.selectedCollectionName})
        case SELECT_LATLNG:
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        case CLEAR_LATLNG:
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        case TOGGLE_COLLECTION_SLIDER:
            console.log('reducer', action)
            const x = merge(uiState, { showCollectionSlider: action.showCollectionSlider })
            console.log('x', x)
            return x

        default:
            return uiState
    }
}
