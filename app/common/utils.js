const _ext = (filename) => {
    return (extension) => {
        return filename.indexOf(extension) !== -1
    }
}

const service = {
    getFileByName: (files, fileName) => {
        return files.find(it => it.name === fileName)
    },

    getFileType: (fileName) => {
        const lowerCaseFileName = fileName ? fileName.toLowerCase() : ''

        const ext = _ext(lowerCaseFileName)

        if (ext('.kml')) return 'kml'

        if (ext('.gpx')) return 'gpx'

        if (ext('.geojson') || ext('.json') || ext('.topojson')) return 'geojson'

        return null
    }
}


//
export default service


