import { combineReducers } from 'redux'
import current from './current'
import ui from './ui'
import tracks from './tracks'
import featureCollections from './feature-collections'


const reducers = combineReducers({
    current,
    ui,
    tracks,
    featureCollections
});

export default reducers
