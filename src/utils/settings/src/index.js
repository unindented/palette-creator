export const minSamplefac = 1
export const maxSamplefac = 30
export const defaultSamplefac = 1

export const minNetsize = 4
export const maxNetsize = 256
export const defaultNetsize = 16

export const formats = ['rgb', 'hsl', 'hsv', 'hwb', 'cmyk', 'xyz', 'lab', 'lch', 'hex']
export const defaultFormat = 'hex'

const defaults = {
  format: defaultFormat
}

export function removeSettings () {
  try {
    localStorage.removeItem('settings')
  } catch (e) {
  }
}

export function loadSettings () {
  let settings

  try {
    settings = JSON.parse(localStorage.getItem('settings'))
  } catch (e) {
    removeSettings()
  }

  return Object.assign({}, defaults, settings)
}

export function saveSettings (settings) {
  try {
    localStorage.setItem('settings', JSON.stringify(Object.assign(loadSettings(), settings)))
  } catch (e) {
    removeSettings()
  }
}
