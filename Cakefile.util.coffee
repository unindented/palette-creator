## Common functions

fs   = require 'fs'
path = require 'path'

# Extracts the dirname, basename and extname from a path.
extractPath = (somePath) ->
  dirname = path.dirname(somePath)
  extname = path.extname(somePath)
  basename = path.basename(somePath, extname)
  [dirname, basename, extname]

# Replaces the extension of a file with the one specified.
fixExtension = (somePath, extension) ->
  [dirname, basename, extname] = extractPath(somePath)
  path.join(dirname, "#{basename}#{extension}")

# Maps the contents of a directory through the specified iterator.
mapDir = (sourceDir, destDir, iterator, success, error) ->
  try
    # If the destination exists and is not a directory, throw an error.
    if path.existsSync(destDir) and not fs.statSync(destDir).isDirectory()
      throw "File exists '#{destDir}'"

    # If the destination directory doesn't exist...
    unless path.existsSync(destDir)
      # ... create it.
      fs.mkdirSync(destDir, fs.statSync(sourceDir).mode)
      # Success callback with created directory.
      if success? then success(sourceDir, destDir)

    # Loop through and copy everything in the subtree.
    fs.readdirSync(sourceDir).forEach((sourceFile) ->
      destFile = path.join(destDir, sourceFile)
      sourceFile = path.join(sourceDir, sourceFile)
      sourceFileStats = fs.statSync(sourceFile)

      # Copy the file or directory.
      if sourceFileStats.isDirectory()
        mapDir(sourceFile, destFile, iterator, success, error)
      else
        iterator(sourceFile, destFile)
    )
  catch e
    # Error callback with error.
    if error? then error(e)

# Copies a file.
copyFile = (sourceFile, destFile, success, error) ->
  try
    # Copy the file.
    if fs.statSync(sourceFile).isSymbolicLink()
      fs.symlinkSync(fs.readlinkSync(sourceFile), destFile)
    else
      fs.writeFileSync(destFile, fs.readFileSync(sourceFile))
    # Success callback with source and destination.
    if success? then success(sourceFile, destFile)
  catch e
    # Error callback with error.
    if error? then error(e)

# Copies a directory recursively.
copyDir = (sourceDir, destDir, success, error) ->
  try
    # If the destination exists and is not a directory, throw an error.
    if path.existsSync(destDir) and not fs.statSync(destDir).isDirectory()
      throw "File exists '#{destDir}'"

    # If the destination directory doesn't exist...
    unless path.existsSync(destDir)
      # ... create it.
      fs.mkdirSync(destDir, fs.statSync(sourceDir).mode)
      # Success callback with created directory.
      if success? then success(sourceDir, destDir)

    # Loop through and copy everything in the subtree.
    fs.readdirSync(sourceDir).forEach((sourceFile) ->
      destFile = path.join(destDir, sourceFile)
      sourceFile = path.join(sourceDir, sourceFile)
      sourceFileStats = fs.statSync(sourceFile)

      # Copy the file or directory.
      if sourceFileStats.isDirectory()
        copyDir(sourceFile, destFile, success, error)
      else
        copyFile(sourceFile, destFile, success, error)
    )
  catch e
    # Error callback with error.
    if error? then error(e)

# Removes a file.
removeFile = (someFile, success, error) ->
  try
    # Remove the file.
    if fs.statSync(someFile).isSymbolicLink()
      fs.unlinkSync(someFile)
    else
      fs.unlinkSync(someFile)
    # Success callback with removed file.
    if success? then success(someFile)
  catch e
    # Error callback with error.
    if error? then error(e)

# Removes a directory recursively.
removeDir = (someDir, success, error) ->
  try
    # If it doesn't exist, do nothing.
    if not path.existsSync(someDir)
      return

    # If it exists, but is not a directory, throw an error.
    if path.existsSync(someDir) and not fs.statSync(someDir).isDirectory()
      throw "Not a directory '#{someDir}'"

    currDir = someDir

    # Loop through and delete its contents.
    fs.readdirSync(currDir).forEach((currFile) ->
      currFile = path.join(currDir, currFile)
      currFileStats = fs.statSync(currFile)

      # Remove the file or directory.
      if currFileStats.isDirectory()
        removeDir(currFile, success, error)
      else
        removeFile(currFile, success, error)
    )

    # Remove the directory.
    fs.rmdirSync(currDir)
    # Success callback with removed directory.
    if success? then success(currDir)
  catch e
    # Error callback with error.
    if error? then error(e)

# ******************************************************************************

exports.extractPath  = extractPath
exports.fixExtension = fixExtension
exports.removeFile   = removeFile
exports.removeDir    = removeDir
exports.copyFile     = copyFile
exports.copyDir      = copyDir
exports.mapDir       = mapDir
