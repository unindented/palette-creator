fs            = require 'fs'
path          = require 'path'
{exec, spawn} = require 'child_process'

# Configuration.
config = {
  src: 'src',
  dst: 'scripts'
}

################################################################################

# ANSI Terminal Colors.
red   = '\033[0;31m'
green = '\033[0;32m'
reset = '\033[0m'

# Log a message with a color.
log = (message, color, explanation) ->
  puts("#{color}#{message}#{reset} #{explanation or ''}")

# Remove a file.
remove = (afile) ->
  log("Deleting #{afile}", green)

  fs.unlink(afile)

# Copy a file.
copy = (srcfile, dstfolder) ->
  log("Copying #{srcfile} to #{dstfolder}", green)

  exec("cp #{srcfile} #{dstfolder}", (err, stdout, stderr) ->
    log(stderr, red) if err
  )

# Extract the dirname, basename and extname from a path.
extpath = (apath) ->
  dirname = path.dirname(apath)
  extname = path.extname(apath)
  basename = path.basename(apath, extname)
  [dirname, basename, extname]

# Compile a CoffeeScript file using the node/coffee interpreter.
compile = (srcfile, dstfolder, wrap, callback) ->
  log("Compiling #{srcfile} to #{dstfolder}", green)

  # prepare the arguments
  args = ['-c', '-o', dstfolder, srcfile]
  args.unshift('--no-wrap') if not wrap
  # spawn the coffee process
  proc = spawn('coffee', args)

  # handle errors
  proc.stderr.addListener('data', (buffer) ->
    log(buffer.toString(), red)
  )

  # callback on exit
  proc.addListener('exit', (status) ->
    [srcdir, srcbase, srcext] = extpath(srcfile)
    dstfile = path.join(dstfolder, "#{srcbase}.js")
    callback(status, dstfile)
  ) if callback?

# Compress a CSS or JavaScript file using yui-compressor.
compress = (srcfile, dstfile, callback) ->
  log("Compressing #{srcfile} to #{dstfile}", green)

  # prepare the arguments
  args = ['-o', dstfile, srcfile]
  # spawn the yui-compressor process
  proc = spawn('yui-compressor', args)

  # handle errors
  proc.stderr.addListener('data', (buffer) ->
    log(buffer.toString(), red)
  )

  # callback on exit
  proc.addListener('exit', (status) ->
    callback(status, dstfile)
  ) if callback?

################################################################################

task 'clean', 'clean the destination directory', () ->
  fs.readdir(config.dst, (err, files) ->
    files.forEach((afile) ->
      dstfile = path.join(config.dst, afile)
      remove(dstfile)
    ) if files?
  )

task 'build', 'build the CoffeeScript files', (options) ->
  fs.readdir(config.src, (err, files) ->
    files.forEach((afile) ->
      srcfile = path.join(config.src, afile)
      [srcdir, srcbase, srcext] = extpath(srcfile)

      switch srcext.substring(1).toLowerCase()
        when 'js'
          copy(srcfile, config.dst)
        when 'coffee'
          wrap = not srcbase.match(/\.worker$/i)
          compile(srcfile, config.dst, wrap, (status, dstfile) ->
            [dstdir, dstbase, dstext] = extpath(dstfile)
            minfile = path.join(dstdir, "#{dstbase}.min#{dstext}")
            compress(dstfile, minfile) if status is 0
          )
    ) if files?
  )

