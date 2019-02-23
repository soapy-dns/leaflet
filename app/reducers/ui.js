import {
    TOGGLE_ELEVATION,
    SELECT_FILE,
    SELECT_LATLNG,
    CLEAR_LATLNG,
    TOGGLE_FILE_SLIDER,
    SHOW_DRAWING_MENU,
    SHOW_MAIN_MENU,
    SELECT_LINE,
    UNSELECT_LINE,
    SELECT_FILE_ID_TO_SAVE
} from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = { showFileSlider: false, menuType: 'main' }

export default function (uiState = defaultState, action) {
    switch (action.type) {
        case TOGGLE_ELEVATION:
        // console.log('toggle elevation', action.boolean)
            return merge(uiState, { showElevation: action.boolean })

        case SELECT_FILE:
            // console.log('SELECT_FILE', action)
            const newState = merge(uiState, { selectedFileId: action.selectedFileId })
            // console.log('newState', newState)
            if (!action.selectedFileId) newState.selectedFileId = null
            // console.log('newState', newState)


            return newState

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

        case SELECT_FILE_ID_TO_SAVE:
        console.log('action', JSON.stringify(action, null, 4))
            return merge(uiState, { selectedFileIdToSave: action.selectedFileIdToSave })

        default:
            return uiState
    }
}
