import React from 'react'
import {render} from 'react-dom'
import Options from 'components/options'
import {trackView, trackTiming, trackException} from 'utils/analytics'

import _template from './options.html'

const init = () => {
  render(<Options />, document.querySelector('#container'))

  trackView()
  trackTiming('Options', 'Load', Date.now() - window.performance.timing.navigationStart)
}

const error = (e) => {
  trackException(e.error)
}

/* ************************************************************************** */

window.addEventListener('load', init, true)
window.addEventListener('error', error, true)
