(function() {
  var Cube, MAX_NODES, MAX_RGB, MAX_TREE_DEPTH, Node, OctreeQuant, QUICK, SHIFT, SQUARES, Search, _ref, _result, x;
  ({
    root: (typeof exports !== "undefined" && exports !== null) ? exports : this
  });
  QUICK = true;
  MAX_RGB = 255;
  MAX_NODES = 266817;
  MAX_TREE_DEPTH = 8;
  SQUARES = (function() {
    _result = []; _ref = -MAX_RGB;
    for (x = _ref; (_ref <= MAX_RGB ? x <= MAX_RGB : x >= MAX_RGB); (_ref <= MAX_RGB ? x += 1 : x -= 1)) {
      _result.push(x * x);
    }
    return _result;
  })();
  SHIFT = (function() {
    _result = [];
    for (x = 0; (0 <= MAX_TREE_DEPTH ? x <= MAX_TREE_DEPTH : x >= MAX_TREE_DEPTH); (0 <= MAX_TREE_DEPTH ? x += 1 : x -= 1)) {
      _result.push(1 << (15 - x));
    }
    return _result;
  })();
  OctreeQuant = function() {
    return this;
  };
  OctreeQuant.prototype.quantizeImage = function(pixels, max_colors) {
    var cube;
    cube = new Cube(pixels, max_colors);
    cube.classification();
    cube.reduction();
    cube.assignment();
    return cube.colormap;
  };
  Cube = function(pixels, max_colors) {
    this.pixels = pixels;
    this.max_colors = max_colors;
    this.colormap = null;
    this.root = null;
    this.depth = 0;
    this.colors = 0;
    this.nodes = 0;
    this.depth = Math.floor(Math.log(max_colors) / Math.log(4)) + 1;
    if (this.depth > MAX_TREE_DEPTH) {
      this.depth = MAX_TREE_DEPTH;
    } else if (this.depth < 2) {
      this.depth = 2;
    }
    this.root = new Node(this);
    return this;
  };
  Cube.prototype.classification = function() {
    var _ref2, _ref3, _ref4, blue, green, height, id, level, node, pixel, red, width, x, y;
    width = this.pixels.length;
    height = this.pixels[0].length;
    _ref2 = width - 1;
    for (x = _ref2; (_ref2 <= 0 ? x <= 0 : x >= 0); (_ref2 <= 0 ? x += 1 : x -= 1)) {
      _ref3 = height - 1;
      for (y = _ref3; (_ref3 <= 0 ? y <= 0 : y >= 0); (_ref3 <= 0 ? y += 1 : y -= 1)) {
        pixel = this.pixels[x][y];
        red = (pixel >> 16) & 0xFF;
        green = (pixel >> 8) & 0xFF;
        blue = (pixel >> 0) & 0xFF;
        if (this.nodes > MAX_NODES) {
          this.root.pruneLevel();
          this.depth--;
        }
        node = this.root;
        _ref4 = this.depth;
        for (level = 1; (1 <= _ref4 ? level <= _ref4 : level >= _ref4); (1 <= _ref4 ? level += 1 : level -= 1)) {
          id = (((red > node.mid_red ? 1 : 0) << 0) | ((green > node.mid_green ? 1 : 0) << 1) | ((blue > node.mid_blue ? 1 : 0) << 2));
          if (!(node.child[id] != null)) {
            new Node(node, id, level);
          }
          node = node.child[id];
          node.number_pixels += SHIFT[level];
        }
        node.unique++;
        node.total_red += red;
        node.total_green += green;
        node.total_blue += blue;
      }
    }
    return this;
  };
  Cube.prototype.reduction = function() {
    var threshold;
    threshold = 1;
    while (this.colors > this.max_colors) {
      this.colors = 0;
      threshold = this.root.reduce(threshold, Number.MAX_VALUE);
    }
    return this;
  };
  Cube.prototype.assignment = function() {
    var _ref2, _ref3, blue, green, height, id, node, pixel, red, search, width, x, y;
    this.colormap = [];
    this.colors = 0;
    this.root.colormap();
    width = this.pixels.length;
    height = this.pixels[0].length;
    search = new Search();
    _ref2 = width - 1;
    for (x = _ref2; (_ref2 <= 0 ? x <= 0 : x >= 0); (_ref2 <= 0 ? x += 1 : x -= 1)) {
      _ref3 = height - 1;
      for (y = _ref3; (_ref3 <= 0 ? y <= 0 : y >= 0); (_ref3 <= 0 ? y += 1 : y -= 1)) {
        pixel = this.pixels[x][y];
        red = (pixel >> 16) & 0xFF;
        green = (pixel >> 8) & 0xFF;
        blue = (pixel >> 0) & 0xFF;
        node = this.root;
        while (true) {
          id = (((red > node.mid_red ? 1 : 0) << 0) | ((green > node.mid_green ? 1 : 0) << 1) | ((blue > node.mid_blue ? 1 : 0) << 2));
          if (!(node.child[id] != null)) {
            break;
          }
          node = node.child[id];
        }
        if (QUICK) {
          this.pixels[x][y] = node.color_number;
        } else {
          search.distance = Number.MAX_VALUE;
          node.parent.closestColor(red, green, blue, search);
          this.pixels[x][y] = search.color_number;
        }
      }
    }
    return this;
  };
  Search = function() {
    this.distance = 0;
    this.color_number = 0;
    return this;
  };
  Node = function(parent, id, level) {
    var bi;
    this.cube = null;
    this.parent = null;
    this.child = null;
    this.nchild = 0;
    this.id = 0;
    this.level = 0;
    this.mid_red = 0;
    this.mid_green = 0;
    this.mid_blue = 0;
    this.number_pixels = 0;
    this.unique = 0;
    this.total_red = 0;
    this.total_green = 0;
    this.total_blue = 0;
    this.color_number = 0;
    if (!(id != null) || !(level != null)) {
      this.cube = parent;
      this.parent = this;
      this.child = [];
      this.id = 0;
      this.level = 0;
      this.number_pixels = Number.MAX_VALUE;
      this.mid_red = (MAX_RGB + 1) >> 1;
      this.mid_green = (MAX_RGB + 1) >> 1;
      this.mid_blue = (MAX_RGB + 1) >> 1;
    } else {
      this.cube = parent.cube;
      this.parent = parent;
      this.child = [];
      this.id = id;
      this.level = level;
      this.cube.nodes++;
      if (this.level === this.cube.depth) {
        this.cube.colors++;
      }
      this.parent.nchild++;
      this.parent.child[this.id] = this;
      bi = (1 << (MAX_TREE_DEPTH - level)) >> 1;
      this.mid_red = this.parent.mid_red + ((this.id & 1) > (0 != null) ? 0 : {
        bi: -bi
      });
      this.mid_green = this.parent.mid_green + ((this.id & 2) > (0 != null) ? 0 : {
        bi: -bi
      });
      this.mid_blue = this.parent.mid_blue + ((this.id & 4) > (0 != null) ? 0 : {
        bi: -bi
      });
    }
    return this;
  };
  Node.prototype.pruneChild = function() {
    this.parent.nchild--;
    this.parent.unique += this.unique;
    this.parent.total_red += this.total_red;
    this.parent.total_green += this.total_green;
    this.parent.total_blue += this.total_blue;
    this.parent.child[this.id] = null;
    this.cube.nodes--;
    this.cube = null;
    this.parent = null;
    return this;
  };
  Node.prototype.pruneLevel = function() {
    var id;
    if (this.nchild !== 0) {
      for (id = 0; id <= 7; id++) {
        if (this.child[id] != null) {
          this.child[id].pruneLevel();
        }
      }
    }
    if (this.level === this.cube.depth) {
      this.pruneChild();
    }
    return this;
  };
  Node.prototype.reduce = function(threshold, next_threshold) {
    var id;
    if (this.nchild !== 0) {
      for (id = 0; id <= 7; id++) {
        if (this.child[id] != null) {
          next_threshold = this.child[id].reduce(threshold, next_threshold);
        }
      }
    }
    if (this.number_pixels <= threshold) {
      this.pruneChild();
    } else {
      if (this.unique !== 0) {
        this.cube.colors++;
      }
      if (this.number_pixels < next_threshold) {
        next_threshold = this.number_pixels;
      }
    }
    return next_threshold;
  };
  Node.prototype.colormap = function() {
    var blue, green, id, red;
    if (this.nchild !== 0) {
      for (id = 0; id <= 7; id++) {
        if (this.child[id] != null) {
          this.child[id].colormap();
        }
      }
    }
    if (this.unique !== 0) {
      red = ((this.total_red + (this.unique >> 1)) / this.unique);
      green = ((this.total_green + (this.unique >> 1)) / this.unique);
      blue = ((this.total_blue + (this.unique >> 1)) / this.unique);
      this.cube.colormap[this.cube.colors] = (((0xFF) << 24) | ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | ((blue & 0xFF) << 0));
      this.color_number = this.cube.colors++;
    }
    return this;
  };
  Node.prototype.closestColor = function(red, green, blue, search) {
    var color, distance, id;
    if (this.nchild !== 0) {
      for (id = 0; id <= 7; id++) {
        if (this.child[id] != null) {
          this.child[id].closestColor(red, green, blue, search);
        }
      }
      if (this.unique !== 0) {
        color = this.cube.colormap[this.color_number];
        distance = this.distance(color, red, green, blue);
        if (distance < search.distance) {
          search.distance = distance;
          search.color_number = this.color_number;
        }
      }
    }
    return this;
  };
  Node.prototype.distance = function(color, red, green, blue) {
    return SQUARES[((color >> 16) & 0xFF) - red + MAX_RGB] + SQUARES[((color >> 8) & 0xFF) - green + MAX_RGB] + SQUARES[((color >> 0) & 0xFF) - blue + MAX_RGB];
  };
  root.OctreeQuant = OctreeQuant;
}).call(this);
