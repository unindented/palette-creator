################################################################################
#
# Query string parser.
#
################################################################################

root = exports ? this

################################################################################

Query = () ->
  result = {}

  search = window.location.search.substring(1)
  vars = search.split("&")

  for i in [0...vars.length]
    pair = vars[i].split("=")
    # if first entry with this name
    if typeof result[pair[0]] == "undefined"
      result[pair[0]] = pair[1]
    # if second entry with this name
    else if typeof result[pair[0]] == "string"
      result[pair[0]] = [ result[pair[0]], pair[1] ]
    # if third or later entry with this name
    else
      result[pair[0]].push(pair[1])

  result

################################################################################

# export Query
root.Query = Query()

