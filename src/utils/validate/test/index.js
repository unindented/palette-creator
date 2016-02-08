import {validateProps} from 'utils/validate'

describe('Validate', function () {
  describe('validateProps', function () {
    it('returns `true` if all properties are valid', function () {
      const props = {
        samplefac: 10,
        netsize: 256,
        format: 'rgb'
      }
      expect(validateProps(props)).toBe(true)
    })

    it('returns `false` if the sampling factor is missing', function () {
      expect(validateProps({samplefac: NaN, netsize: 16, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the sampling factor is below the minimum', function () {
      expect(validateProps({samplefac: 0, netsize: 16, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the sampling factor is above the maximum', function () {
      expect(validateProps({samplefac: 31, netsize: 16, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the network size is missing', function () {
      expect(validateProps({samplefac: 10, netsize: NaN, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the network size is below the minimum', function () {
      expect(validateProps({samplefac: 10, netsize: 3, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the network size is above the maximum', function () {
      expect(validateProps({samplefac: 10, netsize: 257, format: 'hex'})).toBe(false)
    })

    it('returns `false` if the format is not supported', function () {
      expect(validateProps({samplefac: 10, netsize: 16, format: 'rgba'})).toBe(false)
    })

    it('returns `false` if the `custom` flag is present', function () {
      expect(validateProps({samplefac: 10, netsize: 16, format: 'rgb', custom: true})).toBe(false)
    })
  })
})
