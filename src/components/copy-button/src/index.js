import {Component, PropTypes} from 'react'
import {Button} from 'react-mdl'
import {autobind} from 'core-decorators'
import copy from 'copy-to-clipboard'
import {t} from 'utils/i18n'
import {stringifyColor} from 'utils/palette'

export default class CopyButton extends Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    palette: PropTypes.arrayOf(PropTypes.array),
    onClick: PropTypes.func
  }

  @autobind
  handleInputRef (input) {
    this._input = input
  }

  @autobind
  handleClick () {
    copy(this._input.value)

    const {onClick} = this.props
    onClick && onClick()
  }

  render () {
    const {format, image, palette} = this.props
    const error = image instanceof Error
    const colors = palette || []
    const text = colors.map(stringifyColor.bind(null, format)).join(', ')

    const isCopySupported = document.queryCommandSupported('copy')

    return (
      <div className='app-copy-button'>
        <Button colored ripple
          disabled={!!error || !colors.length || !isCopySupported}
          onClick={this.handleClick}
        >
          {t('msg_copy_button_label')}
        </Button>
        <input type='hidden' value={text}
          ref={this.handleInputRef}
        />
      </div>
    )
  }
}
