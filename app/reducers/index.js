import { combineReducers } from 'redux'
import current from './current'
import ui from './ui'
import files from './files'


const reducers = combineReducers({
    current,
    ui,
    files
});

export default reducers
