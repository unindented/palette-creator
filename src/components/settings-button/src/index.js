import {Component, PropTypes} from 'react'
import {Button, Menu, MenuItem} from 'react-mdl'
import {t} from 'utils/i18n'
import {formats} from 'utils/settings'

export default class SettingsButton extends Component {
  static propTypes = {
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    onChangeFormat: PropTypes.func
  }

  constructor () {
    super()

    // Create map of handlers to avoid binding on render.
    this._handleChangeFormatMap = formats.reduce((memo, format) => {
      memo[format] = this.handleChangeFormat.bind(this, format)
      return memo
    }, {})
  }

  handleChangeFormat (format) {
    const {onChangeFormat} = this.props
    onChangeFormat && onChangeFormat(format)
  }

  render () {
    const {image} = this.props
    const error = image instanceof Error

    return (
      <div className='app-settings-button'>
        <Button id='app-settings-button' colored ripple
          disabled={!!error}
        >
          {t('msg_settings_button_label')}
        </Button>
        <Menu target='app-settings-button' valign='top'>
          {formats.map((format) => (
            <MenuItem key={format}
              onClick={this._handleChangeFormatMap[format]}
            >
              {t(`msg_format_${format}`)}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}
