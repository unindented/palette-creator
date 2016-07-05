import React from 'react'
import Options from 'components/options'
import {render} from 'utils/test'

describe('Options', function () {
  beforeEach(function () {
    this.element = render(<Options />)
  })

  it('renders with the correct class name', function () {
    expect(this.element).toHaveClass('app-options')
  })
})
