import {stringify} from 'querystring'
import {t} from 'utils/i18n'
import {defaultSamplefac} from 'utils/settings'
import {createContextMenu, createTab, getExtensionUrl} from 'utils/platform'
import {trackView} from 'utils/analytics'

import _template from './background.html'

const createCustomTab = (params, url) => {
  params = Object.assign({url: btoa(url)}, params)

  createTab({
    url: getExtensionUrl(`foreground.html?${stringify(params)}`)
  })
}

const createCustomContextMenu = (params, label) => {
  createContextMenu({
    'title': t(label),
    'contexts': ['image'],
    'onclick': (info) => createCustomTab(params, info.srcUrl)
  })
}

const init = () => {
  const items = {
    'menu_palette_8': {samplefac: defaultSamplefac, netsize: 8},
    'menu_palette_16': {samplefac: defaultSamplefac, netsize: 16},
    'menu_palette_24': {samplefac: defaultSamplefac, netsize: 24},
    'menu_palette_32': {samplefac: defaultSamplefac, netsize: 32},
    'menu_palette_custom': {custom: true}
  }

  Object.keys(items).forEach((key) => (
    createCustomContextMenu(items[key], key)
  ))

  trackView()
}

/* ************************************************************************** */

window.addEventListener('load', init, true)
