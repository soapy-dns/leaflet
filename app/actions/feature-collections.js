'use strict'

export const NEW_FEATURE_COLLECTION = 'fc/NEW_FEATURE_COLLECTION'
export const newFeatureCollection = (fcText, filename) => ({
    type: NEW_FEATURE_COLLECTION,
    fcText,
    filename
})
