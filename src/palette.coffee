################################################################################
#
# Palette generator.
#
################################################################################

QUANT_WORKER   = 'scripts/neuquant.worker.js'

STATE_INITIAL  = 'initial'
STATE_WAITING  = 'waiting'
STATE_LOADING  = 'loading'
STATE_LOADED   = 'loaded'

INVALID_URL    = ''

INVALID_SAMPLE = 0
DEFAULT_SAMPLE = 1
MIN_SAMPLE     = 1
MAX_SAMPLE     = 30
STEP_SAMPLE    = 1

INVALID_SIZE   = 0
DEFAULT_SIZE   = 16
MIN_SIZE       = 8
MAX_SIZE       = 64
STEP_SIZE      = 1

MIN_ROTATION   = 5
MAX_ROTATION   = 10

################################################################################

wrapperElem   = null          # content wrapper
frameElem     = null          # image frame
imageElem     = null          # image to process
colorsElem    = null          # resulting colors

urlElem       = null          # hidden input for url
sizeElem      = null          # range input for size
sizeValueElem = null          # actual value for size

urlParam    = INVALID_URL     # image url
sampleParam = INVALID_SAMPLE  # sampling factor
sizeParam   = INVALID_SIZE    # palette size


init = ->
  # init query parameters
  initParams()

   # init controls
  initControls()

 # if we have all the necessary parameters
  if sampleParam != INVALID_SAMPLE and sizeParam != INVALID_SIZE
    # init frame and image, and add event listener
    initImage(urlParam, true)
    # hide parameters dialog
    setState(STATE_INITIAL)
  # if not
  else
    # setup dialog
    initDialog(urlParam, true)
    # init frame and image, but don't add event listener
    initImage(urlParam, false)
    # show parameters dialog
    setState(STATE_WAITING)

initControls = ->
  # main elements
  wrapperElem   = document.getElementById('wrapper')
  frameElem     = document.getElementById('frame')
  imageElem     = document.getElementById('image')
  colorsElem    = document.getElementById('colors')

  # dialog elements
  urlElem       = document.getElementById('url')
  sizeElem      = document.getElementById('size')
  sizeValueElem = document.getElementById('sizevalue')

initParams = ->
  # query parameters
  urlParam    = decodeURIComponent(Query.url or "#{INVALID_URL}")
  sampleParam = parseInt(decodeURIComponent(Query.sample or "#{INVALID_SAMPLE}"))
  sizeParam   = parseInt(decodeURIComponent(Query.size or "#{INVALID_SIZE}"))
  # validations
  sampleParam = DEFAULT_SAMPLE if sampleParam == INVALID_SAMPLE or sampleParam < MIN_SAMPLE or sampleParam > MAX_SAMPLE
  sizeParam   = INVALID_SIZE if sizeParam == INVALID_SIZE or sizeParam < MIN_SIZE or sizeParam > MAX_SIZE

initDialog = (url, listen) ->
  # initialize url input
  urlElem.value  = url
  # initialize size input
  sizeElem.min   = MIN_SIZE
  sizeElem.max   = MAX_SIZE
  sizeElem.step  = STEP_SIZE
  sizeElem.value = DEFAULT_SIZE

  # add event listener to size
  sizeElem.addEventListener('change', ((event) -> sizeValueElem.textContent = event.target.value), true) if listen
  # and trigger the event so that the current value is shown
  Utils.fireEvent(sizeElem, 'change')

initImage = (url, listen) ->
  # rotate frame
  deg = rotation(MIN_ROTATION, MAX_ROTATION)
  frameElem.style.cssText = "-webkit-transform: rotate(#{deg}deg)"

  # add event listener to image
  imageElem.addEventListener('load', ((event) -> processImage(event.target)), true) if listen
  # and set its url
  imageElem.src = url

rotation = (min, max) ->
  sign = if Math.floor(Math.random() * 2) then 1 else -1
  return sign * (Math.random() * (max - min) + min)


setState = (state) ->
  wrapperElem.className = state
  msg = chrome.i18n.getMessage("msg_#{state}")
  setMessage(msg) if msg?

setMessage = (msg) ->
  frameElem.title = msg
  imageElem.alt   = msg


processImage = (image) ->
  setState(STATE_LOADING)

  # without using web workers
  # pixels = getPixels(event.target)
  # quant = new NeuQuant(pixels, sample, size)
  # quant.init()
  # quant.convertPixels(pixels)
  # showColors(quant.getColorMap())
  # setState(STATE_LOADED)

  # using web workers
  worker = new Worker(QUANT_WORKER)
  # message handler
  worker.onmessage = ((event) ->
    data = event.data
    switch data.type
      when 'log'
        console.log(data.message) if console?
      when 'palette'
        showColors(data.palette)
        setState(STATE_LOADED)
  )
  # error handler
  worker.onerror = ((event) ->
    throw new Error("#{event.message} (#{event.filename}:#{event.lineno})")
  )

  worker.postMessage({
    'type':   'quantize'
    'pixels': getPixels(image)
    'sample': sampleParam
    'colors': sizeParam
  })


getPixels = (image) ->
  canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)

  return context.getImageData(0, 0, canvas.width, canvas.height).data


showColors = (palette) ->
  fragment = document.createDocumentFragment()

  len = palette.length >> 2
  for l in [0 .. len - 1]
    i = l << 2
    r = palette[i    ]
    g = palette[i + 1]
    b = palette[i + 2]

    color = createColor(r, g, b)
    fragment.appendChild(color)

  # remove previous children
  while colorsElem.hasChildNodes()
    colorsElem.removeChild(colorsElem.firstChild)
  # and add the new ones
  colorsElem.appendChild(fragment)

createColor = (r, g, b) ->
  hex = rgbToHex(r, g, b)

  return Utils.createElement({
    'tagName':    'li'
    'className':  'color'
    'childNodes': [{
      'tagName':    'div'
      'className':  'strip'
      'cssText':    "background-color: rgb(#{r}, #{g}, #{b})"
    }, {
      'tagName':     'div'
      'className':   'info'
      'childNodes':  [{
        'tagName':     'p'
        'textContent': "RGB: #{r}, #{g}, #{b}"
      }, {
        'tagName':     'p'
        'textContent': "HEX: ##{hex}"
      }]
    }]
  })

rgbToHex = (r, g, b) ->
  hex = (r << 16) | (g << 8) | (b)
  hex = hex.toString(16).toUpperCase()
  # add padding
  while hex.length < 6
    hex = "0#{hex}"

  return hex


################################################################################

window.addEventListener('load', init, true)

