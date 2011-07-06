################################################################################
#
# Common utils.
#
################################################################################

root = exports ? this

################################################################################

if not String::trim
  String::trim = ->
    return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1")

################################################################################

Utils =

  showElement: (elem) ->
    Utils.displayElem(elem, true)

  hideElement: (elem) ->
    Utils.displayElem(elem, false)

  displayElement: (elem, display) ->
    elem.style.cssText = if display then 'opacity: 1' else 'opacity: 0'


  createElement: (template) ->
    return if not template?

    elem = document.createElement(template.tagName)
    delete template.tagName

    for attrib, value of template
      switch attrib
        when 'childNodes'
          for childTemplate in value
            elem.appendChild(Utils.createElement(childTemplate))
        when 'cssText'
          elem.style.cssText = value
        else
          elem[attrib] = value

    return elem

  clearElement: (elem) ->
    while elem.firstChild
      elem.removeChild(elem.firstChild)

    return elem


  fireEvent: (elem, evname) ->
    return if not elem? or not evname?

    event = document.createEvent('HTMLEvents')
    event.initEvent(evname, true, true)
    elem.dispatchEvent(event)

    return event


  reload: ->
    window.location = window.location

################################################################################

# export Utils
root.Utils = Utils

