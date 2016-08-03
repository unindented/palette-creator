import React, {Component, PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-mdl'
import {autobind} from 'core-decorators'
import {t} from 'utils/i18n'

import _styles from './index.scss'

export default class CustomImage extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([
      PropTypes.instanceOf(Node),
      PropTypes.instanceOf(Error)
    ]),
    palette: PropTypes.arrayOf(PropTypes.array),
    onLoad: PropTypes.func,
    onError: PropTypes.func
  }

  @autobind
  handleLoad (evt) {
    const {onLoad} = this.props
    onLoad && onLoad(evt.target)
  }

  @autobind
  handleError (evt) {
    const {onError} = this.props
    onError && onError(evt.target)
  }

  render () {
    const {url, image, palette} = this.props
    const state = (palette ? 'finished' : image ? 'quantizing' : 'loading')

    return (
      <Card className="app-image" shadow={2}
        style={{backgroundImage: 'url(' + url + ')'}}
      >
        <CardTitle expand>
          <span className="visuallyhidden">
            {t('msg_image_title')}
          </span>
        </CardTitle>
        <CardText>
          <img src={url}
            crossOrigin="anonymous"
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </CardText>
        <CardActions>
          <span className="app-image__message">
            {t(`msg_image_state_${state}`)}
          </span>
        </CardActions>
      </Card>
    )
  }
}
