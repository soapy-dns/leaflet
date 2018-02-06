import { TOGGLE_ELEVATION } from '../actions/ui'

const merge = (uiState, thing) => Object.assign({}, uiState, thing)

const defaultState = {}

export default function (uiState = defaultState, action) {
    console.log('uiState', uiState)
    switch (action.type) {
        case TOGGLE_ELEVATION:
            return merge(uiState, { showElevation: action.boolean })
        default:
            return uiState
    }
}
