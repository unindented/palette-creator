import _shim from 'es6-shim'
import jqueryMatchers from 'jasmine-jquery-matchers'

beforeEach(function () {
  jasmine.addMatchers(jqueryMatchers)
})

const requireAll = (context) => {
  context.keys().forEach(context)
}

requireAll(require.context('./src/components', true, /\/test\/.*\.jsx?$/))
requireAll(require.context('./src/utils', true, /\/test\/.*\.jsx?$/))
