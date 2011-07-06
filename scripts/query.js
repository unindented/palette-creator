(function() {
  var Query, root;
  root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
  Query = function() {
    var _ref, i, pair, result, search, vars;
    result = {};
    search = window.location.search.substring(1);
    vars = search.split("&");
    _ref = vars.length;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      pair = vars[i].split("=");
      if (typeof result[pair[0]] === "undefined") {
        result[pair[0]] = pair[1];
      } else if (typeof result[pair[0]] === "string") {
        result[pair[0]] = [result[pair[0]], pair[1]];
      } else {
        result[pair[0]].push(pair[1]);
      }
    }
    return result;
  };
  root.Query = Query();
}).call(this);
