(function() {
  var createTab, init, root;
  var __hasProp = Object.prototype.hasOwnProperty;
  root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
  init = function() {
    var _i, _result, items, label;
    items = {
      'menu_palette_16': {
        sample: 1,
        size: 16
      },
      'menu_palette_24': {
        sample: 1,
        size: 24
      },
      'menu_palette_32': {
        sample: 1,
        size: 32
      },
      'menu_palette_custom': null
    };
    _result = [];
    for (_i in items) {
      if (!__hasProp.call(items, _i)) continue;
      (function() {
        var label = _i;
        var params = items[_i];
        return _result.push(label ? chrome.contextMenus.create({
          'title': chrome.i18n.getMessage(label),
          'contexts': ['image'],
          'onclick': function(info, tab) {
            return createTab(info.srcUrl, params);
          }
        }) : undefined);
      })();
    }
    return _result;
  };
  createTab = function(url, params) {
    var tabUrl;
    tabUrl = ("palette.html?url=" + (encodeURIComponent(url)));
    if ((params != null) && (params.sample != null)) {
      tabUrl += ("&sample=" + (encodeURIComponent(params.sample)));
    }
    if ((params != null) && (params.size != null)) {
      tabUrl += ("&size=" + (encodeURIComponent(params.size)));
    }
    return chrome.tabs.create({
      'url': chrome.extension.getURL(tabUrl)
    });
  };
  window.addEventListener('load', init, true);
}).call(this);
