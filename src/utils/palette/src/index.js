import padStart from 'lodash/padStart'
import convert from 'color-convert'
import {palette} from 'neuquant-js'

function groupPalette (colors) {
  const res = []
  for (let i = 0, l = colors.length; i < l;) {
    res.push([colors[i++], colors[i++], colors[i++]])
  }
  return res
}

function weighColor (rgb) {
  // Relative luminance: http://www.w3.org/TR/WCAG20/#relativeluminancedef
  const weights = [0.2126, 0.7152, 0.0722]
  return rgb.reduce((memo, chan, i) => {
    chan = chan / 255
    chan = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4)
    return memo + weights[i] * chan
  }, 0)
}

function sortPalette (colors) {
  return colors.sort((a, b) => weighColor(b) - weighColor(a))
}

export function getDimensions (naturalWidth, naturalHeight) {
  const widthRatio = Math.min(naturalWidth, 2048) / naturalWidth
  const heightRatio = Math.min(naturalHeight, 2048) / naturalHeight
  const ratio = Math.min(widthRatio, heightRatio)
  const width = Math.round(naturalWidth * ratio)
  const height = Math.round(naturalHeight * ratio)
  return {width, height}
}

export function extractPixels (img) {
  const {width, height} = getDimensions(img.naturalWidth, img.naturalHeight)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const rgba = ctx.getImageData(0, 0, width, height).data
  const rgb = new Uint8ClampedArray(rgba.length * 3 / 4)

  for (let i = 0, j = 0, l = rgba.length; i < l;) {
    rgb[j++] = rgba[i++] // R
    rgb[j++] = rgba[i++] // G
    rgb[j++] = rgba[i++] // B
    i++ // skip A
  }

  return rgb
}

export function extractPalette (pixels, options) {
  let colors = palette(pixels, options)
  colors = groupPalette(colors)
  colors = sortPalette(colors)
  return colors
}

export function exportPalette (colors) {
  const columns = colors.map((color) => (
    color.map((chan) => padStart(chan, 3)).join(' ')
  )).join('\n')

  return `GIMP Palette
Name: Custom
#
${columns}
`
}

export function stringifyColor (format, color) {
  let result = color
  if (format !== 'rgb') {
    result = convert.rgb[format](color)
  }
  result = [].concat(result).join(', ')
  if (format === 'hex') {
    result = `#${result}`
  }
  return result
}
