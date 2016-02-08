import {t, dir} from 'utils/i18n'

describe('I18n', function () {
  describe('t', function () {
    it('gets the corresponding translation', function () {
      expect(t('foo', 'bar', 42)).toBe('foo')
    })
  })

  describe('dir', function () {
    it('returns `rtl` for right-to-left languages', function () {
      expect(dir('he-IL')).toBe('rtl')
    })

    it('returns `ltr` for left-to-right languages', function () {
      expect(dir('es-ES')).toBe('ltr')
    })
  })
})
