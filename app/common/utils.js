export const getFileByName = (files, fileName) => {
    return files.find(it => it.name === fileName)
}

