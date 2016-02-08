require('../manifest.json')
require.context('_locales', true, /.*\.json/)
require.context('assets', false, /icon_.*\.png/)

export function createContextMenu () {
  return window.browser.contextMenus.create.apply(chrome.contextMenus, arguments)
}

export function createTab () {
  return window.browser.tabs.create.apply(chrome.tabs, arguments)
}

export function getExtensionManifest () {
  return window.browser.runtime.getManifest()
}

export function getExtensionUrl () {
  return window.browser.extension.getURL.apply(chrome.extension, arguments)
}

export function getI18nMessage () {
  return window.browser.i18n.getMessage.apply(chrome.i18n, arguments)
}
