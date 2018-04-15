import {
    TOGGLE_ELEVATION,
    SELECT_FILE,
    SELECT_LATLNG,
    CLEAR_LATLNG,
    TOGGLE_FILE_SLIDER,
    SHOW_DRAWING_MENU,
    SHOW_MAIN_MENU,
    SELECT_LINE,
    UNSELECT_LINE
} from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = { showFileSlider: false, menuType: 'main' }

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
            return merge(uiState, { showFileSlider: action.showFileSlider })

        case SHOW_MAIN_MENU:
            return merge(uiState, {menuType: 'main'})

        case SHOW_DRAWING_MENU:
            return merge(uiState, {menuType: 'drawing'})

        case SELECT_LINE:
            console.log('selectedLineId', action.selectedLineId)
            return merge(uiState, {selectedLineId: action.selectedLineId})

        case UNSELECT_LINE:
            return merge(uiState, {selectedLineId: undefined})

        default:
            return uiState
    }
}
