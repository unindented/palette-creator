import React from 'react'
import AboutDialog from 'components/about-dialog'
import {render} from 'utils/test'

describe('AboutDialog', function () {
  beforeEach(function () {
    this.element = render(<AboutDialog />)
  })

  it('renders with the correct tag name', function () {
    expect(this.element).toHaveTag('dialog')
  })

  it('renders with the correct class name', function () {
    expect(this.element).toHaveClass('app-about-dialog')
  })
})
