import React, {Component, PropTypes} from 'react'
import {extractPixels} from 'utils/palette'
import {validateProps} from 'utils/validate'
import Worker from './worker'

export default class Quantizer extends Component {
  static propTypes = {
    samplefac: PropTypes.number,
    netsize: PropTypes.number,
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    palette: PropTypes.arrayOf(PropTypes.array),
    onLoad: PropTypes.func
  }

  render () {
    const {samplefac, netsize, image, palette, onLoad} = this.props
    const loaded = !!image && !palette
    const error = image instanceof Error
    const isReady = validateProps(this.props) && loaded && !error

    if (isReady) {
      const pixels = extractPixels(image)
      const worker = new Worker()
      const then = Date.now()
      worker.addEventListener('message', (evt) => {
        onLoad && onLoad(evt.data.colors, Date.now() - then)
      })
      worker.postMessage({pixels, samplefac, netsize})
    }

    return (
      <div className='app-quantizer hidden' />
    )
  }
}
