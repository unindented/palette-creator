## Logging functions

util = require 'util'

# ANSI terminal colors.
red    = '\x1B[0;31m'
green  = '\x1B[0;32m'
yellow = '\x1B[0;33m'
reset  = '\x1B[0m'

# Logs a message to the console.
log = (message, color, explanation) ->
  util.log("#{color}#{message}#{reset} #{explanation or ''}")

# Logs a message with *INFO* level.
info = (message, color, explanation) ->
  log(message, green, explanation)

# Logs a message with *WARN* level.
warn = (message, color, explanation) ->
  log(message, yellow, explanation)

# Logs a message with *ERROR* level.
error = (message, color, explanation) ->
  log(message, red, explanation)

# ******************************************************************************

exports.info  = info
exports.warn  = warn
exports.error = error
