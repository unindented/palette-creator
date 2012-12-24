################################################################################
#
# NeuQuant image quantization algorithm.
#
# Copyright (c) 1994 Anthony Dekker       (original C and Java implementations)
# Copyright (c) 2010 Daniel Perez Alvarez (port to CoffeeScript)
#
################################################################################
#
# NeuQuant - Neural-Net Quantization Algorithm by Anthony Dekker, 1994.
# 
# See "Kohonen neural networks for optimal color quantization" in
# "Network: Computation in Neural Systems" Vol. 5 (1994) pp. 351-367 for a
# discussion of the algorithm.
#
# See also http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
#
#
# Any party obtaining a copy of these files from the author, directly or
# indirectly, is granted, free of charge, a full and unrestricted irrevocable,
# world-wide, paid up, royalty-free, nonexclusive right and license to deal in
# this software and documentation files (the "Software"), including without
# limitation the rights to use, copy, modify, merge, publish, distribute,
# sublicense, and/or sell copies of the Software, and to permit persons who
# receive copies from any such party to do so, with the only requirement being
# that this copyright notice remain intact.
#
################################################################################

addEventListener('message', (event) ->
  data = event.data
  switch data.type
    when 'quantize'
      quant = new NeuQuant(data.pixels, data.sample, data.colors)
      quant.init()
      quant.convertPixels(data.pixels)
      # send back the palette to the caller
      postMessage({
        'type':    'palette',
        'palette': quant.getColorMap()
      })
)

log = (message) ->
  # send the log message to the caller
  postMessage({
    'type':    'log',
    'message': message
  })

################################################################################

class NeuQuant

  constructor: (pixels, sample, netsize) ->
    size = pixels.length >> 2

    # four primes near 500 - assume no image has a length so large
    # that it is divisible by all four primes

    @prime1 = 499
    @prime2 = 491
    @prime3 = 487
    @prime4 = 503

    @maxprime = @prime4

    # validations

    throw "Image is too small"         if size < @maxprime
    throw "Sample must be 1..30"       if not sample  in [1 .. 30]
    throw "Color count must be 4..256" if not netsize in [4 .. 256]

    @ncycles         = 100                       # number of learning cycles

    @pixels          = pixels                    # image pixels
    @sample          = sample                    # sampling factor

    @netsize         = netsize                   # number of colors used
    @specials        = 1                         # number of reserved colors used
    @bgcolor         = @specials - 1             # reserved background color

    @cutnetsize      = @netsize - @specials
    @maxnetpos       = @netsize - 1

    @initradius      = Math.floor(@netsize / 8)  # for 256 colors, radius starts at 32
    @radiusbiasshift = 6
    @radiusbias      = 1 << @radiusbiasshift
    @initbiasradius  = @initradius * @radiusbias
    @radiusdec       = 30                        # factor of 1/30 each cycle

    @alphabiasshift  = 10                        # alpha starts at 1
    @initalpha       = 1 << @alphabiasshift      # biased by 10 bits

    @gamma           = 1024.0
    @beta            = 1.0 / 1024.0
    @betagamma       = @beta * @gamma

    # setup arrays

    @setupArrays()

  setupArrays: ->
    @network  = @createArray(0.0, @netsize, 3) # the network itself
    @colormap = @createArray(0, @netsize, 4)   # the color map
    @netindex = @createArray(0, 256)           # for network lookup

    @bias     = @createArray(0.0, @netsize)    # bias and freq arrays for learning
    @freq     = @createArray(0.0, @netsize)

    @network[0][0] = 0.0    # black
    @network[0][1] = 0.0
    @network[0][2] = 0.0

    @network[1][0] = 255.0  # white
    @network[1][1] = 255.0
    @network[1][2] = 255.0

    for i in [0 ... @specials]
      @freq[i] = 1.0 / @netsize
      @bias[i] = 0.0

    for i in [@specials ... @netsize]
      p = @network[i]
      p[0] = (255.0 * (i - @specials)) / @cutnetsize
      p[1] = (255.0 * (i - @specials)) / @cutnetsize
      p[2] = (255.0 * (i - @specials)) / @cutnetsize

      @freq[i] = 1.0 / @netsize
      @bias[i] = 0.0

    return this

  createArray: (value, dimensions...) ->
    return value if not dimensions? or dimensions.length is 0

    arr = new Array(dimensions.shift())

    self = arguments.callee
    args = [value].concat(dimensions)
    for i in [0 ... arr.length]
      arr[i] = self.apply(this, args)

    return arr

  init: ->
    @learn()
    @fix()
    @build()

    return this

  learn: ->
    biasradius = @initbiasradius
    alphadec = 30 + Math.floor((@sample - 1) / 3)
    lengthcount = @pixels.length >> 2
    samplepixels = Math.floor(lengthcount / @sample)
    delta = Math.floor(samplepixels / @ncycles)
    alpha = @initalpha

    rad = biasradius >> @radiusbiasshift
    if rad <= 1
      rad = 0

    log("Beginning 1D learning: sample pixels = " + samplepixels + "; radius = " + rad)

    step = 0
    pos = 0

    if lengthcount % @prime1 isnt 0
      step = @prime1
    else if lengthcount % @prime2 isnt 0
      step = @prime2
    else if lengthcount % @prime3 isnt 0
      step = @prime3
    else
      step = @prime4

    i = 0
    while i < samplepixels
      t = pos << 2
      r = @pixels[t    ]
      g = @pixels[t + 1]
      b = @pixels[t + 2]

      j = @specialFind(b, g, r)
      j = if j < 0 then @contest(b, g, r) else j

      if j >= @specials
        # don't learn for specials
        a = alpha / @initalpha
        @alterSingle(a, j, b, g, r)
        if rad > 0
          @alterNeighbors(a, rad, j, b, g, r)

      pos += step
      while pos >= lengthcount
        pos -= lengthcount

      i++
      if i % delta is 0
        alpha -= Math.floor(alpha / alphadec)
        biasradius -= Math.floor(biasradius / @radiusdec)
        rad = biasradius >> @radiusbiasshift
        if rad <= 1
          rad = 0

    log("Finished 1D learning: final alpha = " + (alpha / @initalpha))

    return this

  fix: ->
    for i in [0 ... @netsize]
      for j in [0 ... 3]
        x = Math.floor(0.5 + @network[i][j])
        if x < 0
          x = 0
        else if x > 255
          x = 255
        @colormap[i][j] = x
      @colormap[i][3] = i

    return this

  build: ->
    # insertion sort of network and building of netindex[0...256]

    previouscol = 0
    startpos = 0

    for i in [0 ... @netsize]
      p = @colormap[i]
      q = null
      smallpos = i
      smallval = p[1]

      # find smallest in i...netsize
      for j in [i + 1 ... @netsize]
        q = @colormap[j]
        if q[1] < smallval
          smallpos = j
          smallval = q[1]
      q = @colormap[smallpos]

      # swap p[i] and q[smallpos] entries
      if i isnt smallpos
        [p[0], q[0]] = [q[0], p[0]]
        [p[1], q[1]] = [q[1], p[1]]
        [p[2], q[2]] = [q[2], p[2]]
        [p[3], q[3]] = [q[3], p[3]]

      # smallval entry is now in position i
      if smallval isnt previouscol
        @netindex[previouscol] = (startpos + i) >> 1
        for j in [previouscol + 1 ... smallval]
          @netindex[j] = i
        previouscol = smallval
        startpos = i

    @netindex[previouscol] = (startpos + @maxnetpos) >> 1
    for j in [previouscol + 1 ... 256]
      @netindex[j] = @maxnetpos

    return this

  alterSingle: (alpha, i, b, g, r) ->
    # move neuron i towards biased (b,g,r) by factor alpha
    n = @network[i]
    n[0] -= (alpha * (n[0] - b))
    n[1] -= (alpha * (n[1] - g))
    n[2] -= (alpha * (n[2] - r))

    return this

  alterNeighbors: (alpha, rad, i, b, g, r) ->
    lo = i - rad
    if lo < @specials - 1
      lo = @specials - 1
    hi = i + rad
    if hi > @netsize
      hi = @netsize

    j = i + 1
    k = i - 1
    q = 0
    while j < hi or k > lo
      a = (alpha * (rad * rad - q * q)) / (rad * rad)
      q++
      if j < hi
        p = @network[j]
        p[0] -= (a * (p[0] - b))
        p[1] -= (a * (p[1] - g))
        p[2] -= (a * (p[2] - r))
        j++
      if k > lo
        p = @network[k]
        p[0] -= (a * (p[0] - b))
        p[1] -= (a * (p[1] - g))
        p[2] -= (a * (p[2] - r))
        k--

    return this

  specialFind: (b, g, r) ->
    for i in [0 ... @specials]
      n = @network[i]
      if n[0] is b and n[1] is g and n[2] is r
        return i
    return -1

  contest: (b, g, r) ->
    # search for biased BGR values:
    # - finds closest neuron (min dist) and updates freq
    # - finds best neuron (min dist - bias) and returns position
    # - for frequently chosen neurons, freq[i] is high and bias[i] is negative
    # - bias[i] = gamma * ((1 / netsize) - freq[i])

    bestd = Number.MAX_VALUE
    bestbiasd = bestd
    bestpos = -1
    bestbiaspos = bestpos

    for i in [@specials ... @netsize]
      n = @network[i]
      dist = n[0] - b
      if dist < 0
        dist = -dist
      a = n[1] - g
      if a < 0
        a = -a
      dist += a
      a = n[2] - r
      if a < 0
        a = -a
      dist += a
      if dist < bestd
        bestd = dist
        bestpos = i
      biasdist = dist - @bias[i]
      if biasdist < bestbiasd
        bestbiasd = biasdist
        bestbiaspos = i

      @freq[i] -= @beta * @freq[i]
      @bias[i] += @betagamma * @freq[i]

    @freq[bestpos] += @beta
    @bias[bestpos] -= @betagamma

    return bestbiaspos

  convertPixels: (pixels) ->
    len = pixels.length >> 2
    for l in [0 ... len]
      t = l << 2

      r = pixels[t    ]
      g = pixels[t + 1]
      b = pixels[t + 2]
      a = pixels[t + 3]

      newpixel = @convertPixel(a, r, g, b)

      pixels[t    ] = newpixel[0]
      pixels[t + 1] = newpixel[1]
      pixels[t + 2] = newpixel[2]
      pixels[t + 3] = newpixel[3]

    return pixels

  convertPixel: (pixel) ->
    a = (pixel >> 24) & 0xff
    r = (pixel >> 16) & 0xff
    g = (pixel >>  8) & 0xff
    b = (pixel      ) & 0xff

    return @convertPixel(a, r, g, b)

  convertPixel: (a, r, g, b) ->
    i = @search(b, g, r)

    b = @colormap[i][0]
    g = @colormap[i][1]
    r = @colormap[i][2]

    return [r, g, b, a]

  search: (b, g, r) ->
    # search for BGR values 0...256 and return color index
    bestd = 1000      # biggest possible dist is 256*3
    best = -1
    i = @netindex[g]  # index on g
    j = i - 1         # start at netindex[g] and work outwards

    while i < @netsize or j >= 0
      if i < @netsize
        p = @colormap[i]
        dist = p[1] - g   # inx key
        if dist >= bestd
          i = @netsize    # stop iter
        else
          if dist < 0
            dist = -dist
          a = p[0] - b
          if a < 0
            a = -a
          dist += a
          if dist < bestd
            a = p[2] - r
            if a < 0
              a = -a
            dist += a
            if (dist < bestd)
              bestd = dist
              best = i
          i++
      if j >= 0
        p = @colormap[j]
        dist = g - p[1]   # inx key - reverse dif
        if dist >= bestd
          j = -1          # stop iter
        else
          if dist < 0
            dist = -dist
          a = p[0] - b
          if a < 0
            a = -a
          dist += a
          if dist < bestd
            a = p[2] - r
            if a < 0
              a = -a
            dist += a
            if dist < bestd
              bestd = dist
              best = j
          j--

    return best

  getColorCount: ->
    return @netsize

  getColorMap: ->
    exportmap = []

    for i in [0 ... @netsize]
      b = @colormap[i][0]
      g = @colormap[i][1]
      r = @colormap[i][2]
      a = 0xff

      exportmap.push(r)
      exportmap.push(g)
      exportmap.push(b)
      exportmap.push(a)

    return exportmap

