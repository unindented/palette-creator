'use strict'

var webpackConfig = require('./webpack.config.factory')

module.exports = function (config) {
  var coverage = config.singleRun

  config.set({
    webpackPort: 9874,
    runnerPort: 9875,
    port: 9876,

    basePath: '',

    files: ['tests.js'],

    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],

    preprocessors: {
      'tests.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig({test: true, coverage: coverage, platform: 'web'}),

    webpackMiddleware: {
      noInfo: true
    },

    reporters: (coverage ? ['dots', 'coverage'] : ['dots']),

    coverageReporter: {
      dir: 'coverage',

      reporters: [
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'},
        {type: 'text'}
      ]
    }
  })
}
