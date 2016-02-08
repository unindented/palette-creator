import {stringifyColor, getDimensions, extractPixels, extractPalette, exportPalette} from 'utils/palette'

const DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAMFBMVEUAAABlgqVaWlqx2vv///87KR4AAAB6sEW7y0N9OyTMQ1qZJizqWXNOFhyWVz6YqLxhsY5yAAAAAXRSTlMAQObYZgAAAMNJREFUeNrt2EEKwzAMRNEkttUmbuP737Yw3WjjkpJAa/HfCf5mQGgCAAD4aL4IAQSMGLBIknxCkkUIIGDcgCL2pSIEEBAjwJzbAeYQQEC8gPsBBBBAAAEE/FUANyEBBPAfIICACwNWJ3dsUmUTAgiIEbBKcXoZVR5ShQACYgSYFMekN72n7EIAATEC3sxJ0ptedgggIEZAluRkZxc/PQIIiBQwSzthFgIIGDegSTqhCQEEjBXg2UUmIYCAXwYAAAD0vQDERKcREgASVAAAAABJRU5ErkJggg=='

describe('Palette', function () {
  describe('stringifyColor', function () {
    it('formats the color to RGB', function () {
      expect(stringifyColor('rgb', [96, 125, 139])).toBe('96, 125, 139')
    })

    it('formats the color to HSL', function () {
      expect(stringifyColor('hsl', [96, 125, 139])).toBe('200, 18, 46')
    })

    it('formats the color to HSV', function () {
      expect(stringifyColor('hsv', [96, 125, 139])).toBe('200, 31, 55')
    })

    it('formats the color to HEX', function () {
      expect(stringifyColor('hex', [96, 125, 139])).toBe('#607D8B')
    })
  })

  describe('getDimensions', function () {
    it('returns the natural dimensions if the image is not big enough', function () {
      expect(getDimensions(1024, 768)).toEqual({width: 1024, height: 768})
    })

    it('returns reduced dimensions if the image is too wide', function () {
      expect(getDimensions(4096, 1536)).toEqual({width: 2048, height: 768})
    })

    it('returns reduced dimensions if the image is too tall', function () {
      expect(getDimensions(1536, 4096)).toEqual({width: 768, height: 2048})
    })
  })

  describe('extractPalette', function () {
    it('extracts the palette of colors from an image', function (done) {
      const img = document.createElement('img')
      img.onload = () => {
        const pixels = extractPixels(img)
        expect(extractPalette(pixels, {netsize: 4})).toEqual([
          [213, 235, 252],
          [136, 131, 104],
          [5, 1, 1],
          [0, 0, 0]
        ])
        done()
      }
      img.src = DATA_URL
    })
  })

  describe('exportPalette', function () {
    it('exports the palette to GPL', function () {
      const palette = [
        [213, 235, 252],
        [136, 131, 104],
        [5, 1, 1],
        [0, 0, 0]
      ]
      const expected = `GIMP Palette
Name: Custom
#
213 235 252
136 131 104
  5   1   1
  0   0   0
`
      expect(exportPalette(palette)).toEqual(expected)
    })
  })
})
