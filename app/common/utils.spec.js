import utils from './utils'

describe.only('utils.js', () => {
    test('getFileType works for gpx', () => {
        const name = 'TEST_NAME'
        const lat = -33, lng = 155

        const gpxResult = utils.getFileType('testfile.gpx')
        const kmlResult = utils.getFileType('testfile.kml')
        const geojsonResult = utils.getFileType('testfile.geojson')

        expect(gpxResult).toBe('gpx')
        expect(kmlResult).toBe('kml')
        expect(geojsonResult).toBe('geojson')
    })

    test('getFileByName', () => {
        const file1 = {name: 'file1'}
        const file2 = {name: 'file2'}
        const files = [
            file1,
            file2
        ]

        const result = utils.getFileByName(files, 'file1')
        expect(result).toEqual(file1)
    })
})

