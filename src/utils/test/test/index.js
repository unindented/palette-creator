import {render} from 'utils/test'

describe('Test', function () {
  describe('#render', function () {
    it('renders a component into a dettached node', function () {
      expect(render(<div />)).toEqual(jasmine.any(Node))
    })
  })
})
