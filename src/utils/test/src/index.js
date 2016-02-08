import {findDOMNode} from 'react-dom'
import {renderIntoDocument} from 'react-addons-test-utils'

export {Simulate} from 'react-addons-test-utils'

export function render (element) {
  return findDOMNode(renderIntoDocument(element))
}
