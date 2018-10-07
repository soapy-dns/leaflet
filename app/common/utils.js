const _ext = (filename) => {
    return (extension) => {
        return filename.indexOf(extension) !== -1
    }
}

const service = {
    getFileById: (files, fileId) => {
        return files.find(it => it.id === fileId)
    },

    // getFileById: (files, id) => {
    //     return files.find(it => it.id === id)
    // },

    getFileType: (fileName) => {
        const lowerCaseFileName = fileName ? fileName.toLowerCase() : ''

        const ext = _ext(lowerCaseFileName)

        if (ext('.kml')) return 'kml'

        if (ext('.gpx')) return 'gpx'

        if (ext('.geojson') || ext('.json') || ext('.topojson')) return 'geojson'

        return null
    },

    getSelectedLine(id, files ) {
        for (let file of files) {
            const foundLine = file.featureCollection.features.find(feature => (feature.id = id))
            if (foundLine) return foundLine
        }
    }
}

//
export default service


