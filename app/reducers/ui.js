import { TOGGLE_ELEVATION, SELECT_COLLECTION } from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = {}

export default function (uiState = defaultState, action) {
    switch (action.type) {
        case TOGGLE_ELEVATION:
            return merge(uiState, { showElevation: action.boolean })
        case SELECT_COLLECTION:
            return merge(uiState, { selectedCollectionName: action.selectedCollectionName})
        default:
            return uiState
    }
}
