import React from 'react'
import SettingsDialog from 'components/settings-dialog'
import {minNetsize, maxNetsize, defaultNetsize, defaultSamplefac} from 'utils/settings'
import {render} from 'utils/test'
import fixture from './image.svg'

describe('SettingsDialog', function () {
  describe('without `samplefac` or `netsize`', function () {
    beforeEach(function () {
      this.element = render(<SettingsDialog url={fixture} />)
    })

    it('renders with the correct tag name', function () {
      expect(this.element).toHaveTag('dialog')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-settings-dialog')
    })

    it('renders a hidden input with the URL', function () {
      const input = this.element.querySelector('input[type="hidden"][name="url"]')
      expect(input).toHaveAttr('value', btoa(fixture))
    })

    it('renders a slider with the default sampling factor', function () {
      const input = this.element.querySelector('input[type="hidden"][name="samplefac"]')
      expect(input.value).toBe(`${defaultSamplefac}`)
    })

    it('renders a slider with the default network size', function () {
      const input = this.element.querySelector('input[type="range"][name="netsize"]')
      expect(input).toHaveAttr('min', `${minNetsize}`)
      expect(input).toHaveAttr('max', `${maxNetsize}`)
      expect(input.value).toBe(`${defaultNetsize}`)
    })

    it('renders a submit action', function () {
      expect(this.element).toHaveDescendantWithText('button[type="submit"]', 'msg_settings_dialog_submit')
    })
  })

  describe('with `samplefac`', function () {
    beforeEach(function () {
      this.element = render(<SettingsDialog url={fixture} samplefac={30} />)
    })

    it('renders with the correct tag name', function () {
      expect(this.element).toHaveTag('dialog')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-settings-dialog')
    })

    it('renders a slider with the default sampling factor', function () {
      const input = this.element.querySelector('input[type="hidden"][name="samplefac"]')
      expect(input.value).toBe('30')
    })
  })

  describe('with `netsize`', function () {
    beforeEach(function () {
      this.element = render(<SettingsDialog url={fixture} netsize={256} />)
    })

    it('renders with the correct tag name', function () {
      expect(this.element).toHaveTag('dialog')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-settings-dialog')
    })

    it('renders a slider with the specified network size', function () {
      const input = this.element.querySelector('input[type="range"][name="netsize"]')
      expect(input).toHaveAttr('min', `${minNetsize}`)
      expect(input).toHaveAttr('max', `${maxNetsize}`)
      expect(input.value).toBe('256')
    })
  })
})
