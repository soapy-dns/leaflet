export const getCollectionByName = (collections, collectionName) => {
    return collections.find(it => it.name === collectionName)
}