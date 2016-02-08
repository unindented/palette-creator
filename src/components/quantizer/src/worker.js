import {extractPalette} from 'utils/palette'

addEventListener('message', (evt) => {
  const {pixels, ...options} = evt.data
  const colors = extractPalette(pixels, options)
  postMessage({colors})
})
