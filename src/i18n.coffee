################################################################################
#
# Internationalization.
#
################################################################################

root = exports ? this

################################################################################

translate = (event) ->
  for elem in document.querySelectorAll('[data-i18n]')
    tag = elem.tagName.toLowerCase()
    key = elem.getAttribute('data-i18n')
    msg = chrome.i18n.getMessage(key)
    switch tag
      when 'input'
        type = elem.type.toLowerCase()
        switch type
          when 'password', 'text'
            elem.placeholder = msg
          else
            elem.value = msg
      else
        elem.textContent = msg

################################################################################

window.addEventListener('load', translate, true)

