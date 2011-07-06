################################################################################
#
# Context menu creation.
#
################################################################################

root = exports ? this

################################################################################

init = ->
  items = {
    'menu_palette_16':     { sample: 1, size: 16 }
    'menu_palette_24':     { sample: 1, size: 24 }
    'menu_palette_32':     { sample: 1, size: 32 }
    'menu_palette_custom': null
  }

  for label, params of items
    chrome.contextMenus.create({
      'title':    chrome.i18n.getMessage(label)
      'contexts': ['image']
      'onclick':  (info, tab) -> createTab(info.srcUrl, params)
    }) if label

createTab = (url, params) ->
  tabUrl  = "palette.html?url=#{encodeURIComponent(url)}"
  tabUrl += "&sample=#{encodeURIComponent(params.sample)}" if params? and params.sample?
  tabUrl += "&size=#{encodeURIComponent(params.size)}" if params? and params.size?

  chrome.tabs.create({
    'url': chrome.extension.getURL(tabUrl)
  })

################################################################################

window.addEventListener('load', init, true)

