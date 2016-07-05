import React from 'react'
import DownloadButton from 'components/download-button'
import {render, Simulate} from 'utils/test'

describe('DownloadButton', function () {
  describe('with a loading image', function () {
    beforeEach(function () {
      const image = new Image()
      this.element = render(<DownloadButton image={image} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-download-button')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_download_button_label')
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
      this.element = render(<DownloadButton image={image} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-download-button')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_download_button_label')
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
      const image = new Image()
      const palette = [
        [213, 235, 252],
        [136, 131, 104],
        [5, 1, 1],
        [0, 0, 0]
      ]
      this.element = render(<DownloadButton image={image} palette={palette} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-download-button')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_download_button_label')
    })

    it('renders a button', function () {
      expect(this.element).toHaveDescendant('button')
    })

    it('renders an enabled button', function () {
      expect(this.element).not.toHaveDescendant('button[disabled]')
    })

    it('renders a hidden link', function () {
      expect(this.element).toHaveDescendant('a.visuallyhidden')
    })

    it('renders a link with a data URL', function () {
      expect(this.element).toHaveDescendant('a[href^="data:"]')
    })

    it('tries to download on click', function () {
      const button = this.element.querySelector('button')
      const link = this.element.querySelector('a')
      spyOn(link, 'click')
      Simulate.click(button)
      expect(link.click).toHaveBeenCalled()
    })
  })
})
