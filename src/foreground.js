import React from 'react'
import {render} from 'react-dom'
import {browserHistory} from 'react-router'
import App from 'components/app'
import {trackView, trackTiming, trackException} from 'utils/analytics'

import _template from './foreground.html'

const init = () => {
  render(<App history={browserHistory} />, document.querySelector('#container'))

  trackView()
  trackTiming('Foreground', 'Load', Date.now() - window.performance.timing.navigationStart)
}

const error = (e) => {
  trackException(e.error)
}

/* ************************************************************************** */

window.addEventListener('load', init, true)
window.addEventListener('error', error, true)
