import React from 'react'
import CopyButton from 'components/copy-button'
import {render} from 'utils/test'

describe('CopyButton', function () {
  describe('with a loading image', function () {
    beforeEach(function () {
      const image = new Image()
      this.element = render(<CopyButton format="hex" image={image} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-copy-button')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_copy_button_label')
    })

    it('renders a button', function () {
      expect(this.element).toHaveDescendant('button')
    })

    it('renders a disabled button', function () {
      expect(this.element).toHaveDescendant('button[disabled]')
    })
  })

  describe('with an errored image', function () {
    beforeEach(function () {
      const image = new Error()
      this.element = render(<CopyButton format="hex" image={image} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-copy-button')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_copy_button_label')
    })

    it('renders a button', function () {
      expect(this.element).toHaveDescendant('button')
    })

    it('renders a disabled button', function () {
      expect(this.element).toHaveDescendant('button[disabled]')
    })
  })

  describe('with a loaded image and a palette', function () {
    beforeEach(function () {
      this.palette = [
        [213, 235, 252],
        [136, 131, 104],
        [5, 1, 1],
        [0, 0, 0]
      ]
    })

    describe('', function () {
      beforeEach(function () {
        this.element = render(<CopyButton format="hex" palette={this.palette} />)
      })

      it('renders with the correct class name', function () {
        expect(this.element).toHaveClass('app-copy-button')
      })

      it('renders with the correct text', function () {
        expect(this.element).toHaveText('msg_copy_button_label')
      })

      it('renders a button', function () {
        expect(this.element).toHaveDescendant('button')
      })
    })

    describe('when copying is not supported', function () {
      beforeEach(function () {
        spyOn(document, 'queryCommandSupported').and.returnValue(false)
        this.element = render(<CopyButton format="hex" palette={this.palette} />)
      })

      it('disables the button', function () {
        const button = this.element.querySelector('button')
        expect(button).toBeDisabled()
      })
    })

    describe('when copying is supported', function () {
      beforeEach(function () {
        spyOn(document, 'queryCommandSupported').and.returnValue(true)
        this.element = render(<CopyButton format="hex" palette={this.palette} />)
      })

      it('enables the button', function () {
        const button = this.element.querySelector('button')
        expect(button).not.toBeDisabled()
      })
    })
  })
})
