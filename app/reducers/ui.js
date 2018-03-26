import { TOGGLE_ELEVATION, SELECT_FILE, SELECT_LATLNG, CLEAR_LATLNG, TOGGLE_FILE_SLIDER } from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = { showFileSlider: false }

export default function (uiState = defaultState, action) {
    switch (action.type) {
        case TOGGLE_ELEVATION:
            return merge(uiState, { showElevation: action.boolean })
        case SELECT_FILE:
            return merge(uiState, { selectedFileName: action.selectedFileName})
        case SELECT_LATLNG:
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        case CLEAR_LATLNG:
            return merge(uiState, { selectedLatitude: action.selectedLatitude, selectedLongitude: action.selectedLongitude })
        case TOGGLE_FILE_SLIDER:
            console.log('reducer', action)
            const x = merge(uiState, { showFileSlider: action.showFileSlider })
            console.log('x', x)
            return x

        default:
            return uiState
    }
}
