require('../manifest.json')
require.context('_locales', true, /.*\.json/)
require.context('assets', false, /icon_.*\.png/)

export function createContextMenu () {
  return window.chrome.contextMenus.create.apply(chrome.contextMenus, arguments)
}

export function createTab () {
  return window.chrome.tabs.create.apply(chrome.tabs, arguments)
}

export function getExtensionManifest () {
  return window.chrome.runtime.getManifest()
}

export function getExtensionUrl () {
  return window.chrome.extension.getURL.apply(chrome.extension, arguments)
}

export function getI18nMessage () {
  return window.chrome.i18n.getMessage.apply(chrome.i18n, arguments)
}
