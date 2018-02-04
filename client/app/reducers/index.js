import { combineReducers } from 'redux'
import currentLayer from './current-layer'
import ui from './ui'


const reducers = combineReducers({
    currentLayer,
    ui
});

export default reducers
