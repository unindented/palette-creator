import {loadSettings, saveSettings} from 'utils/settings'

describe('Settings', function () {
  describe('loadSettings', function () {
    it('invokes callback with settings', function (done) {
      loadSettings(function (settings) {
        expect(settings).toEqual({format: 'hex', samplefac: 1, netsize: 16})
        done()
      })
    })
  })

  describe('saveSettings', function () {
    it('invokes callback', function (done) {
      saveSettings({format: 'rgb'}, done)
    })
  })
})
