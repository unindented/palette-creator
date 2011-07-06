(function() {
  var root, translate;
  root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
  translate = function(event) {
    var _i, _len, _ref, _result, elem, key, msg, tag, type;
    _result = []; _ref = document.querySelectorAll('[data-i18n]');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      _result.push((function() {
        tag = elem.tagName.toLowerCase();
        key = elem.getAttribute('data-i18n');
        msg = chrome.i18n.getMessage(key);
        switch (tag) {
          case 'input':
            type = elem.type.toLowerCase();
            switch (type) {
              case 'password':
              case 'text':
                return (elem.placeholder = msg);
              default:
                return (elem.value = msg);
            }
            break;
          default:
            return (elem.textContent = msg);
        }
      })());
    }
    return _result;
  };
  window.addEventListener('load', translate, true);
}).call(this);
