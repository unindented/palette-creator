import 'es6-shim'
import * as jqueryMatchers from 'jasmine-jquery-matchers'

beforeEach(function () {
  jasmine.addMatchers(jqueryMatchers)
})

const requireAll = (context) => {
  context.keys().forEach(context)
}

requireAll(require.context('./src/components', true, /\/test\/.*\.jsx?$/))
requireAll(require.context('./src/utils', true, /\/test\/.*\.jsx?$/))
