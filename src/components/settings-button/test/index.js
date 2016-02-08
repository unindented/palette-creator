import SettingsButton from 'components/settings-button'
import {formats} from 'utils/settings'
import {render, Simulate} from 'utils/test'

describe('SettingsButton', function () {
  describe('with a loading image', function () {
    beforeEach(function () {
      const image = new Image()
      this.clickSpy = jasmine.createSpy()
      this.element = render(<SettingsButton image={image} onChangeFormat={this.clickSpy} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-settings-button')
    })

    it('renders a button', function () {
      expect(this.element).toHaveDescendant('button#app-settings-button')
    })

    it('renders an enabled button', function () {
      expect(this.element).not.toHaveDescendant('button[disabled]')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_settings_button_label')
    })

    it('renders a menu associated to the button', function () {
      expect(this.element).toHaveDescendant('ul[data-mdl-for="app-settings-button"]')
    })

    it('renders a menu item for each supported format', function () {
      const menu = this.element.querySelector('ul[data-mdl-for="app-settings-button"]')
      expect(menu).toHaveDescendantWithText(`li:nth-child(${formats.length})`, 'msg_format_hex')
    })

    it('invokes `onChangeFormat` when clicking on a format', function () {
      const item = this.element.querySelector('ul[data-mdl-for="app-settings-button"] li')
      Simulate.click(item)
      expect(this.clickSpy).toHaveBeenCalledWith(jasmine.any(String))
    })
  })

  describe('with an errored image', function () {
    beforeEach(function () {
      const image = new Error()
      this.clickSpy = jasmine.createSpy()
      this.element = render(<SettingsButton image={image} onChangeFormat={this.clickSpy} />)
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-settings-button')
    })

    it('renders a button', function () {
      expect(this.element).toHaveDescendant('button#app-settings-button')
    })

    it('renders a disabled button', function () {
      expect(this.element).toHaveDescendant('button[disabled]')
    })

    it('renders with the correct text', function () {
      expect(this.element).toHaveText('msg_settings_button_label')
    })
  })
})
