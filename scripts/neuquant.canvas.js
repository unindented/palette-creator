(function() {
  var NeuQuant;
  var __slice = Array.prototype.slice;
  ({
    root: (typeof exports !== "undefined" && exports !== null) ? exports : this
  });
  NeuQuant = function(pixels, sample, netsize) {
    var _i, _len, _ref, _result, size;
    size = pixels.length >> 2;
    this.prime1 = 499;
    this.prime2 = 491;
    this.prime3 = 487;
    this.prime4 = 503;
    this.maxprime = this.prime4;
    if (size < this.maxprime) {
      throw "Image is too small";
    }
    if ((function(){ for (var _i=0, _len=(_ref = (function() {
      _result = [];
      for (_i = 1; _i <= 30; _i++){ _result.push(_i); }
      return _result;
    }).call(this)).length; _i<_len; _i++) { if (_ref[_i] === !sample) return true; } return false; }).call(this)) {
      throw "Sample must be 1..30";
    }
    if ((function(){ for (var _i=0, _len=(_ref = (function() {
      _result = [];
      for (_i = 4; _i <= 256; _i++){ _result.push(_i); }
      return _result;
    }).call(this)).length; _i<_len; _i++) { if (_ref[_i] === !netsize) return true; } return false; }).call(this)) {
      throw "Color count must be 4..256";
    }
    this.ncycles = 100;
    this.pixels = pixels;
    this.sample = sample;
    this.netsize = netsize;
    this.specials = 1;
    this.bgcolor = this.specials - 1;
    this.cutnetsize = this.netsize - this.specials;
    this.maxnetpos = this.netsize - 1;
    this.initradius = Math.floor(this.netsize / 8);
    this.radiusbiasshift = 6;
    this.radiusbias = 1 << this.radiusbiasshift;
    this.initbiasradius = this.initradius * this.radiusbias;
    this.radiusdec = 30;
    this.alphabiasshift = 10;
    this.initalpha = 1 << this.alphabiasshift;
    this.gamma = 1024.0;
    this.beta = 1.0 / 1024.0;
    this.betagamma = this.beta * this.gamma;
    this.setupArrays();
    return this;
  };
  NeuQuant.prototype.setupArrays = function() {
    var _ref, _ref2, i, p;
    this.network = this.createArray(0.0, this.netsize, 3);
    this.colormap = this.createArray(0, this.netsize, 4);
    this.netindex = this.createArray(0, 256);
    this.bias = this.createArray(0.0, this.netsize);
    this.freq = this.createArray(0.0, this.netsize);
    this.network[0][0] = 0.0;
    this.network[0][1] = 0.0;
    this.network[0][2] = 0.0;
    this.network[1][0] = 255.0;
    this.network[1][1] = 255.0;
    this.network[1][2] = 255.0;
    _ref = this.specials;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      this.freq[i] = 1.0 / this.netsize;
      this.bias[i] = 0.0;
    }
    _ref = this.specials; _ref2 = this.netsize;
    for (i = _ref; (_ref <= _ref2 ? i < _ref2 : i > _ref2); (_ref <= _ref2 ? i += 1 : i -= 1)) {
      p = this.network[i];
      p[0] = (255.0 * (i - this.specials)) / this.cutnetsize;
      p[1] = (255.0 * (i - this.specials)) / this.cutnetsize;
      p[2] = (255.0 * (i - this.specials)) / this.cutnetsize;
      this.freq[i] = 1.0 / this.netsize;
      this.bias[i] = 0.0;
    }
    return this;
  };
  NeuQuant.prototype.createArray = function(value) {
    var _ref, args, arr, dimensions, i, self;
    dimensions = __slice.call(arguments, 1);
    if (!(dimensions != null) || dimensions.length === 0) {
      return value;
    }
    arr = new Array(dimensions.shift());
    self = arguments.callee;
    args = [value].concat(dimensions);
    _ref = arr.length;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      arr[i] = self.apply(this, args);
    }
    return arr;
  };
  NeuQuant.prototype.init = function() {
    this.learn();
    this.fix();
    this.build();
    return this;
  };
  NeuQuant.prototype.learn = function() {
    var a, alpha, alphadec, b, biasradius, delta, g, i, j, lengthcount, pos, r, rad, samplepixels, step, t;
    biasradius = this.initbiasradius;
    alphadec = 30 + Math.floor((this.sample - 1) / 3);
    lengthcount = this.pixels.length >> 2;
    samplepixels = Math.floor(lengthcount / this.sample);
    delta = Math.floor(samplepixels / this.ncycles);
    alpha = this.initalpha;
    rad = biasradius >> this.radiusbiasshift;
    if (rad <= 1) {
      rad = 0;
    }
    if (typeof console !== "undefined" && console !== null) {
      console.log("Beginning 1D learning: sample pixels = " + samplepixels + "; radius = " + rad);
    }
    step = 0;
    pos = 0;
    if (lengthcount % this.prime1 !== 0) {
      step = this.prime1;
    } else if (lengthcount % this.prime2 !== 0) {
      step = this.prime2;
    } else if (lengthcount % this.prime3 !== 0) {
      step = this.prime3;
    } else {
      step = this.prime4;
    }
    i = 0;
    while (i < samplepixels) {
      t = pos << 2;
      r = this.pixels[t];
      g = this.pixels[t + 1];
      b = this.pixels[t + 2];
      j = this.specialFind(b, g, r);
      j = j < 0 ? this.contest(b, g, r) : j;
      if (j >= this.specials) {
        a = alpha / this.initalpha;
        this.alterSingle(a, j, b, g, r);
        if (rad > 0) {
          this.alterNeighbors(a, rad, j, b, g, r);
        }
      }
      pos += step;
      while (pos >= lengthcount) {
        pos -= lengthcount;
      }
      i++;
      if (i % delta === 0) {
        alpha -= Math.floor(alpha / alphadec);
        biasradius -= Math.floor(biasradius / this.radiusdec);
        rad = biasradius >> this.radiusbiasshift;
        if (rad <= 1) {
          rad = 0;
        }
      }
    }
    if (typeof console !== "undefined" && console !== null) {
      console.log("Finished 1D learning: final alpha = " + (alpha / this.initalpha));
    }
    return this;
  };
  NeuQuant.prototype.fix = function() {
    var _ref, i, j, x;
    _ref = this.netsize;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      for (j = 0; j < 3; j++) {
        x = Math.floor(0.5 + this.network[i][j]);
        if (x < 0) {
          x = 0;
        } else if (x > 255) {
          x = 255;
        }
        this.colormap[i][j] = x;
      }
      this.colormap[i][3] = i;
    }
    return this;
  };
  NeuQuant.prototype.build = function() {
    var _ref, _ref2, _ref3, i, j, p, previouscol, q, smallpos, smallval, startpos;
    previouscol = 0;
    startpos = 0;
    _ref = this.netsize;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      p = this.colormap[i];
      q = null;
      smallpos = i;
      smallval = p[1];
      _ref2 = i + 1; _ref3 = this.netsize;
      for (j = _ref2; (_ref2 <= _ref3 ? j < _ref3 : j > _ref3); (_ref2 <= _ref3 ? j += 1 : j -= 1)) {
        q = this.colormap[j];
        if (q[1] < smallval) {
          smallpos = j;
          smallval = q[1];
        }
      }
      q = this.colormap[smallpos];
      if (i !== smallpos) {
        _ref2 = [q[0], p[0]], p[0] = _ref2[0], q[0] = _ref2[1];
        _ref2 = [q[1], p[1]], p[1] = _ref2[0], q[1] = _ref2[1];
        _ref2 = [q[2], p[2]], p[2] = _ref2[0], q[2] = _ref2[1];
        _ref2 = [q[3], p[3]], p[3] = _ref2[0], q[3] = _ref2[1];
      }
      if (smallval !== previouscol) {
        this.netindex[previouscol] = (startpos + i) >> 1;
        _ref2 = previouscol + 1;
        for (j = _ref2; (_ref2 <= smallval ? j < smallval : j > smallval); (_ref2 <= smallval ? j += 1 : j -= 1)) {
          this.netindex[j] = i;
        }
        previouscol = smallval;
        startpos = i;
      }
    }
    this.netindex[previouscol] = (startpos + this.maxnetpos) >> 1;
    _ref = previouscol + 1;
    for (j = _ref; (_ref <= 256 ? j < 256 : j > 256); (_ref <= 256 ? j += 1 : j -= 1)) {
      this.netindex[j] = this.maxnetpos;
    }
    return this;
  };
  NeuQuant.prototype.alterSingle = function(alpha, i, b, g, r) {
    var n;
    n = this.network[i];
    n[0] -= (alpha * (n[0] - b));
    n[1] -= (alpha * (n[1] - g));
    n[2] -= (alpha * (n[2] - r));
    return this;
  };
  NeuQuant.prototype.alterNeighbors = function(alpha, rad, i, b, g, r) {
    var a, hi, j, k, lo, p, q;
    lo = i - rad;
    if (lo < this.specials - 1) {
      lo = this.specials - 1;
    }
    hi = i + rad;
    if (hi > this.netsize) {
      hi = this.netsize;
    }
    j = i + 1;
    k = i - 1;
    q = 0;
    while (j < hi || k > lo) {
      a = (alpha * (rad * rad - q * q)) / (rad * rad);
      q++;
      if (j < hi) {
        p = this.network[j];
        p[0] -= (a * (p[0] - b));
        p[1] -= (a * (p[1] - g));
        p[2] -= (a * (p[2] - r));
        j++;
      }
      if (k > lo) {
        p = this.network[k];
        p[0] -= (a * (p[0] - b));
        p[1] -= (a * (p[1] - g));
        p[2] -= (a * (p[2] - r));
        k--;
      }
    }
    return this;
  };
  NeuQuant.prototype.specialFind = function(b, g, r) {
    var _ref, i, n;
    _ref = this.specials;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      n = this.network[i];
      if (n[0] === b && n[1] === g && n[2] === r) {
        return i;
      }
    }
    return -1;
  };
  NeuQuant.prototype.contest = function(b, g, r) {
    var _ref, _ref2, a, bestbiasd, bestbiaspos, bestd, bestpos, biasdist, dist, i, n;
    bestd = Number.MAX_VALUE;
    bestbiasd = bestd;
    bestpos = -1;
    bestbiaspos = bestpos;
    _ref = this.specials; _ref2 = this.netsize;
    for (i = _ref; (_ref <= _ref2 ? i < _ref2 : i > _ref2); (_ref <= _ref2 ? i += 1 : i -= 1)) {
      n = this.network[i];
      dist = n[0] - b;
      if (dist < 0) {
        dist = -dist;
      }
      a = n[1] - g;
      if (a < 0) {
        a = -a;
      }
      dist += a;
      a = n[2] - r;
      if (a < 0) {
        a = -a;
      }
      dist += a;
      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }
      biasdist = dist - this.bias[i];
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }
      this.freq[i] -= this.beta * this.freq[i];
      this.bias[i] += this.betagamma * this.freq[i];
    }
    this.freq[bestpos] += this.beta;
    this.bias[bestpos] -= this.betagamma;
    return bestbiaspos;
  };
  NeuQuant.prototype.convertPixels = function(pixels) {
    var a, b, g, l, len, newpixel, r, t;
    len = pixels.length >> 2;
    for (l = 0; (0 <= len ? l < len : l > len); (0 <= len ? l += 1 : l -= 1)) {
      t = l << 2;
      r = pixels[t];
      g = pixels[t + 1];
      b = pixels[t + 2];
      a = pixels[t + 3];
      newpixel = this.convertPixel(a, r, g, b);
      pixels[t] = newpixel[0];
      pixels[t + 1] = newpixel[1];
      pixels[t + 2] = newpixel[2];
      pixels[t + 3] = newpixel[3];
    }
    return pixels;
  };
  NeuQuant.prototype.convertPixel = function(pixel) {
    var a, b, g, r;
    a = (pixel >> 24) & 0xff;
    r = (pixel >> 16) & 0xff;
    g = (pixel >> 8) & 0xff;
    b = (pixel) & 0xff;
    return this.convertPixel(a, r, g, b);
  };
  NeuQuant.prototype.convertPixel = function(a, r, g, b) {
    var i;
    i = this.search(b, g, r);
    b = this.colormap[i][0];
    g = this.colormap[i][1];
    r = this.colormap[i][2];
    return [r, g, b, a];
  };
  NeuQuant.prototype.search = function(b, g, r) {
    var a, best, bestd, dist, i, j, p;
    bestd = 1000;
    best = -1;
    i = this.netindex[g];
    j = i - 1;
    while (i < this.netsize || (j >= 0)) {
      if (i < this.netsize) {
        p = this.colormap[i];
        dist = p[1] - g;
        if (dist >= bestd) {
          i = this.netsize;
        } else {
          if (dist < 0) {
            dist = -dist;
          }
          a = p[0] - b;
          if (a < 0) {
            a = -a;
          }
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) {
              a = -a;
            }
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = i;
            }
          }
          i++;
        }
      }
      if (j >= 0) {
        p = this.colormap[j];
        dist = g - p[1];
        if (dist >= bestd) {
          j = -1;
        } else {
          if (dist < 0) {
            dist = -dist;
          }
          a = p[0] - b;
          if (a < 0) {
            a = -a;
          }
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) {
              a = -a;
            }
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = j;
            }
          }
          j--;
        }
      }
    }
    return best;
  };
  NeuQuant.prototype.getColorCount = function() {
    return this.netsize;
  };
  NeuQuant.prototype.getColorMap = function() {
    var _ref, a, b, exportmap, g, i, r;
    exportmap = [];
    _ref = this.netsize;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      b = this.colormap[i][0];
      g = this.colormap[i][1];
      r = this.colormap[i][2];
      a = 0xff;
      exportmap.push(r);
      exportmap.push(g);
      exportmap.push(b);
      exportmap.push(a);
    }
    return exportmap;
  };
  root.NeuQuant = NeuQuant;
}).call(this);
