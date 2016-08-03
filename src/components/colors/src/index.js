import React, {Component, PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions, Spinner} from 'react-mdl'
import {autobind} from 'core-decorators'
import classNames from 'classnames'
import {parse} from 'url'
import CopyButton from 'components/copy-button'
import DownloadButton from 'components/download-button'
import SettingsButton from 'components/settings-button'
import {t} from 'utils/i18n'
import {stringifyColor} from 'utils/palette'
import {validateProps} from 'utils/validate'

import _styles from './index.scss'

export default class Colors extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    palette: PropTypes.arrayOf(PropTypes.array),
    onChangeFormat: PropTypes.func,
    onCopy: PropTypes.func,
    onDownload: PropTypes.func
  }

  @autobind
  handleChangeFormat (format) {
    const {onChangeFormat} = this.props
    onChangeFormat && onChangeFormat(format)
  }

  @autobind
  handleCopy () {
    const {onCopy} = this.props
    onCopy && onCopy()
  }

  @autobind
  handleDownload () {
    const {onDownload} = this.props
    onDownload && onDownload()
  }

  render () {
    const {url, format, image, palette} = this.props
    const host = url && parse(url).host
    const colors = palette || []
    const loaded = !!image && colors.length > 0
    const error = image instanceof Error
    const isReady = validateProps(this.props)

    return (
      <Card className={classNames('app-colors', {hidden: !isReady})} shadow={2}>
        <CardTitle>
          <span className="visuallyhidden">
            {t('msg_colors_title')}
          </span>
        </CardTitle>
        <CardText>
          {!loaded && !error && (
            <div className="app-colors__spinner">
              <Spinner />
            </div>
          )}
          {!loaded && !!error && (
            <p className="app-colors__error">
              {t('msg_colors_error', host)}
            </p>
          )}
          <ul className="app-colors__list">
            {colors.map((color) => (
              <li key={color.join(', ')} className="app-colors__list-item">
                <div className="app-colors__list-item-color"
                  style={{backgroundColor: `rgb(${color.join(', ')})`}}
                />
                <div className="app-colors__list-item-info">
                  {t(`msg_format_${format}`) + ': '}
                  {stringifyColor(format, color)}
                </div>
              </li>
            ))}
          </ul>
        </CardText>
        <CardActions>
          <SettingsButton {...this.props}
            disabled={!loaded || !!error}
            onChangeFormat={this.handleChangeFormat}
          />
          <CopyButton {...this.props}
            disabled={!loaded || !!error}
            onClick={this.handleCopy}
          />
          <DownloadButton {...this.props}
            disabled={!loaded || !!error}
            onClick={this.handleDownload}
          />
        </CardActions>
      </Card>
    )
  }
}
