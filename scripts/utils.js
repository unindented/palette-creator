(function() {
  var Utils, root;
  var __hasProp = Object.prototype.hasOwnProperty;
  root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    };
  }
  Utils = {
    showElement: function(elem) {
      return Utils.displayElem(elem, true);
    },
    hideElement: function(elem) {
      return Utils.displayElem(elem, false);
    },
    displayElement: function(elem, display) {
      return (elem.style.cssText = display ? 'opacity: 1' : 'opacity: 0');
    },
    createElement: function(template) {
      var _i, _len, attrib, childTemplate, elem, value;
      if (!(template != null)) {
        return null;
      }
      elem = document.createElement(template.tagName);
      delete template.tagName;
      for (attrib in template) {
        if (!__hasProp.call(template, attrib)) continue;
        value = template[attrib];
        switch (attrib) {
          case 'childNodes':
            for (_i = 0, _len = value.length; _i < _len; _i++) {
              childTemplate = value[_i];
              elem.appendChild(Utils.createElement(childTemplate));
            }
            break;
          case 'cssText':
            elem.style.cssText = value;
            break;
          default:
            elem[attrib] = value;
        }
      }
      return elem;
    },
    clearElement: function(elem) {
      while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
      return elem;
    },
    fireEvent: function(elem, evname) {
      var event;
      if (!(elem != null) || !(evname != null)) {
        return null;
      }
      event = document.createEvent('HTMLEvents');
      event.initEvent(evname, true, true);
      elem.dispatchEvent(event);
      return event;
    },
    reload: function() {
      return (window.location = window.location);
    }
  };
  root.Utils = Utils;
}).call(this);
