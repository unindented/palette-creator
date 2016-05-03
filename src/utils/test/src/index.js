import {findDOMNode} from 'react-dom'
import {renderIntoDocument, Simulate} from 'react-addons-test-utils'

export {Simulate}

export function render (element) {
  return findDOMNode(renderIntoDocument(element))
}
