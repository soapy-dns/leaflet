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
export const UPDATE_FEATURE_COLLECTION = 'fc/UPDATE_FEATURE_COLLECTION'
export const updateFeatureCollection = (feature, selectedCollectionName) => ({
        type: UPDATE_FEATURE_COLLECTION,
        feature,
        selectedCollectionName
})