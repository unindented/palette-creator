import Colors from 'components/colors'
import {render} from 'utils/test'

describe('Colors', function () {
  describe('without the necessary properties', function () {
    beforeEach(function () {
      const props = {
        url: 'foo',
        format: 'hex'
      }
      this.element = render(<Colors {...props} />)
    })

    it('is hidden', function () {
      expect(this.element).toHaveClass('hidden')
    })
  })

  describe('when custom', function () {
    beforeEach(function () {
      const props = {
        url: 'foo',
        format: 'hex',
        samplefac: 1,
        netsize: 4,
        custom: true
      }
      this.element = render(<Colors {...props} />)
    })

    it('is hidden', function () {
      expect(this.element).toHaveClass('hidden')
    })
  })

  describe('with a loading image', function () {
    beforeEach(function () {
      const image = new Image()
      const props = {
        url: 'foo',
        format: 'hex',
        samplefac: 1,
        netsize: 4,
        image
      }
      this.element = render(<Colors {...props} />)
    })

    it('is not hidden', function () {
      expect(this.element).not.toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-colors')
    })

    it('renders a spinner', function () {
      expect(this.element).toHaveDescendant('.app-colors__spinner')
    })
  })

  describe('with an errored image', function () {
    beforeEach(function () {
      const image = new Error()
      const props = {
        url: 'foo',
        format: 'hex',
        samplefac: 1,
        netsize: 4,
        image
      }
      this.element = render(<Colors {...props} />)
    })

    it('is not hidden', function () {
      expect(this.element).not.toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-colors')
    })

    it('renders an error', function () {
      expect(this.element).toHaveDescendant('.app-colors__error')
    })
  })

  describe('with a loaded image and a palette', function () {
    beforeEach(function () {
      const image = new Image()
      const palette = [
        [213, 235, 252],
        [136, 131, 104],
        [5, 1, 1],
        [0, 0, 0]
      ]
      const props = {
        url: 'foo',
        format: 'hex',
        samplefac: 1,
        netsize: 4,
        image,
        palette
      }
      this.element = render(<Colors {...props} />)
    })

    it('is not hidden', function () {
      expect(this.element).not.toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-colors')
    })

    it('renders the list of colors', function () {
      expect(this.element).toHaveDescendant('.app-colors__list')
    })

    it('renders a list item for each color', function () {
      expect(this.element).toHaveDescendant('.app-colors__list-item:nth-child(4)')
    })

    it('renders the name of the color inside each list item', function () {
      const info = this.element.querySelector('.app-colors__list-item-info')
      expect(info).toHaveText(/msg_format_hex: #D5EBFC/i)
    })

    it('render the actual color inside each list item', function () {
      const color = this.element.querySelector('.app-colors__list-item-color')
      expect(color).toHaveCss({'background-color': 'rgb(213, 235, 252)'})
    })

    it('renders a settings action', function () {
      expect(this.element).toHaveDescendant('.app-settings-button')
    })

    it('renders a copy action', function () {
      expect(this.element).toHaveDescendant('.app-copy-button')
    })

    it('renders a download action', function () {
      expect(this.element).toHaveDescendant('.app-download-button')
    })
  })
})
