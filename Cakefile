require 'coffee-script'

fs   = require('fs')
path = require('path')
exec = require('child_process').exec

log  = require('./Cakefile.log')
util = require('./Cakefile.util')

### Configuration ##############################################################

config =
  src:  'src'
  dist: 'scripts'

### Build Rules ################################################################

rules =
  # Files to ignore.
  ignore:
    regex: /^_/
  # CoffeeScript files.
  coffee:
    regex: /\.coffee$/i
    ext:   '.js'
    make:  (sourceFile, destFile) ->
      # Compile it...
      [sourceDir, sourceBase, sourceExt] = util.extractPath(sourceFile)
      coffeeOpts = []
      coffeeOpts.push('--compile')
      coffeeOpts.push('--print')
      coffeeOpts.push('--bare') if sourceBase.match(/\.worker$/i)
      coffeeCmd = "coffee #{coffeeOpts.join(' ')} #{sourceFile} > #{destFile}"
      run(coffeeCmd, ->
        log.info("Compiled '#{sourceFile}' to '#{destFile}'")
        # ... and minify it.
        uglifyOpts = []
        uglifyOpts.push('--overwrite')
        uglifyCmd = "uglifyjs #{uglifyOpts.join(' ')} #{destFile}"
        run(uglifyCmd, ->
          log.info("Minified '#{destFile}'")
        )
      )
  # JavaScript files.
  js:
    regex: /\.js$/i
    ext:   '.js'
    make:  (sourceFile, destFile) ->
      # Minify it.
      uglifyOpts = []
      uglifyCmd = "uglifyjs #{uglifyOpts.join(' ')} #{sourceFile} > #{destFile}"
      run(uglifyCmd, ->
        log.info("Minified '#{sourceFile}' to '#{destFile}'")
      )
  # LESS files.
  less:
    regex: /\.less$/i
    ext:   '.css'
    make:  (sourceFile, destFile) ->
      # Compile it.
      lessOpts = []
      lessOpts.push('--compress')
      lessCmd = "lessc #{lessOpts.join(' ')} #{sourceFile} > #{destFile}"
      run(lessCmd, ->
        log.info("Compiled '#{sourceFile}' to '#{destFile}'")
      )
  # Other files.
  other:
    regex: /.*/
    make:  (sourceFile, destFile) ->
      # Just copy it.
      copyCmd = "cp #{sourceFile} #{destFile}"
      run(copyCmd, ->
        log.info("Copied '#{sourceFile}' to '#{destFile}'")
      )

# This function applies the above rules to the specified file.
make = (sourceFile, destFile) ->
  [sourceDir, sourceBase, sourceExt] = util.extractPath(sourceFile)
  sourceFilename = sourceBase + sourceExt

  for name, rule of rules
    # If if matches the regex of the rule...
    if sourceFilename.match(rule.regex)
      # ... fix the extension...
      destFile = util.fixExtension(destFile, rule.ext) if rule.ext?
      # ... and execute the rule.
      rule.make(sourceFile, destFile) if rule.make?
      break

# This function runs a command.
run = (cmd, callback) ->
  exec(cmd, (err, stdout, stderr) ->
    log.info(stdout) if stdout
    log.error(stderr) if stderr
    #throw err if err?

    callback() if callback? and not err?
  )

### Tasks ######################################################################

task 'clean', 'clean the destination directory', (options) ->
  # Remove the destination directory.
  util.removeDir(config.dist,
    ((removedFile) -> log.info("Removed '#{removedFile}'")),
    ((err)         -> log.error(err))
  )

task 'build', 'build the source files', (options) ->
  # Clean the destination directory.
  invoke 'clean'
  # Make every file in the source directory.
  util.mapDir(config.src, config.dist, make)

task 'watch', 'watch the source files and build them as necessary', (options) ->
  # Build the source files.
  invoke 'build'
  # Watch them so that they get rebuilt when modified.
  util.mapDir(config.src, config.dist,
    ((sourceFile, destFile) ->
      fs.watchFile(sourceFile, { persistent: true, interval: 500 },
        ((curr, prev) ->
          return if curr.size is prev.size and curr.mtime.getTime() is prev.mtime.getTime()
          make(sourceFile, destFile)
        )
      )
    )
  )

