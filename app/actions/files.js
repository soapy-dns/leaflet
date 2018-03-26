'use strict'

export const NEW_FILE = 'file/NEW_FILE'
export const newFile = (fileText, filename) => ({
    type: NEW_FILE,
    fileText,
    filename
})

/*
 add feature to feature collection - should perhaps change the name
 */
export const ADD_FEATURE_TO_FILE = 'file/ADD_FEATURE_TO_FILE'
export const addFeatureToFile = (feature, selectedFileName) => ({
    type: ADD_FEATURE_TO_FILE,
    feature,
    selectedFileName
})

export const MOVE_FEATURE_AND_OPEN = 'file/MOVE_FEATURE_AND_OPEN'
export const moveFeatureAndOpen = (feature, selectedFileName) => {
    // do stuff


}

export const UPDATE_FILES = 'file/UPDATE_FILES'
export const updateFiles = (files) => ({
    type: UPDATE_FILES,
    collections: files,
})

export const MARK_FILE_AS_SAVED = 'file/MARK_FILE_AS_SAVED'
export const markFileAsSaved = file => ({
    type: MARK_FILE_AS_SAVED,
    collection: file
})

// TODO - wip
export const UPDATE_WAYPOINT_POSITION = 'file/UPDATE_WAYPOINT_POSITION'
export const updateWaypointPosition = (fileName, waypointId, latlng) => ({
    type: UPDATE_WAYPOINT_POSITION,
    waypointId,
    fileName,
    latlng
})