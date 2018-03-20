'use strict'

export const NEW_FEATURE_COLLECTION = 'fc/NEW_FEATURE_COLLECTION'
export const newFeatureCollection = (fcText, filename) => ({
    type: NEW_FEATURE_COLLECTION,
    fcText,
    filename
})

/*
 add feature to feature collection - should perhaps change the name
 */
export const ADD_FEATURE_TO_COLLECTION = 'fc/ADD_FEATURE_TO_COLLECTION'
export const addFeatureToCollection = (feature, selectedCollectionName) => ({
    type: ADD_FEATURE_TO_COLLECTION,
    feature,
    selectedCollectionName
})

export const MOVE_FEATURE_AND_OPEN = 'fc/MOVE_FEATURE_AND_OPEN'
export const moveFeatureAndOpen = (feature, selectedCollectionName) => {
    // do stuff


}

export const UPDATE_COLLECTIONS = 'fc/UPDATE_COLLECTIONS'
export const updateCollections = (collections) => ({
    type: UPDATE_COLLECTIONS,
    collections: collections,
})

export const MARK_COLLECTION_AS_SAVED = 'fc/MARK_COLLECTION_AS_SAVED'
export const markCollectionAsSaved = collection => ({
    type: MARK_COLLECTION_AS_SAVED,
    collection: collection
})
