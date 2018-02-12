import { SAVE_MAP_DETAILS } from '../actions/current'

const merge = (currentState, thing) => Object.assign({}, currentState, thing)

export default function (currentState = {}, action) {
    switch (action.type) {
        case SAVE_MAP_DETAILS:
            return merge(currentState, action.mapDetails)
            // return action.track

        default:
            return currentState
    }
}
