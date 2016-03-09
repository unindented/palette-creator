import {getItems, setItems} from 'utils/platform'

export const minSamplefac = 1
export const maxSamplefac = 30
export const defaultSamplefac = 1

export const minNetsize = 4
export const maxNetsize = 256
export const defaultNetsize = 16

export const formats = ['rgb', 'hsl', 'hsv', 'hwb', 'cmyk', 'xyz', 'lab', 'lch', 'hex']
export const defaultFormat = 'hex'

const defaults = {
  format: defaultFormat,
  samplefac: defaultSamplefac,
  netsize: defaultNetsize
}

export function defaultSettings () {
  return defaults
}

export function loadSettings (callback) {
  getItems(defaultSettings(), callback)
}

export function saveSettings (settings, callback) {
  setItems(settings, callback)
}
