import {Component, PropTypes} from 'react'
import {Button} from 'react-mdl'
import {autobind} from 'core-decorators'
import {t} from 'utils/i18n'
import {exportPalette} from 'utils/palette'

export default class DownloadButton extends Component {
  static propTypes = {
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    palette: PropTypes.arrayOf(PropTypes.array),
    onClick: PropTypes.func
  }

  @autobind
  handleLinkRef (link) {
    this._link = link
  }

  @autobind
  handleClick () {
    this._link.click()

    const {onClick} = this.props
    onClick && onClick()
  }

  render () {
    const {image, palette} = this.props
    const error = image instanceof Error
    const colors = palette || []
    const blob = btoa([exportPalette(colors)])
    const href = `data:text/plain;base64,${blob}`
    const download = 'palette.gpl'

    return (
      <div className='app-download-button'>
        <Button colored ripple
          disabled={!!error || !colors.length}
          onClick={this.handleClick}
        >
          {t('msg_download_button_label')}
        </Button>
        <a className='visuallyhidden' href={href} download={download}
          ref={this.handleLinkRef}
        />
      </div>
    )
  }
}
