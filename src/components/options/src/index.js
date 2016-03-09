import {Component} from 'react'
import {autobind} from 'core-decorators'
import {t} from 'utils/i18n'
import {isTrackingPermitted, setTrackingPermitted} from 'utils/analytics'

import _styles from './index.scss'

export default class Options extends Component {
  constructor () {
    super()

    this.state = {trackingPermitted: false}

    isTrackingPermitted(function (permitted) {
      this.setState({trackingPermitted: permitted})
    }.bind(this))
  }

  @autobind
  handleChangeAnalytics (evt) {
    const {checked} = evt.target
    setTrackingPermitted(checked)
    this.setState({trackingPermitted: checked})
  }

  render () {
    const {trackingPermitted} = this.state

    return (
      <div className='app-options'>
        <p>
          <i>{t('msg_options_instructions_label')}</i>
        </p>
        <label className='app-options__option'>
          <input type='checkbox' id='app-options-analytics' className='app-options__checkbox'
            checked={trackingPermitted}
            onChange={this.handleChangeAnalytics}
          />
          <span className='app-options__label'>
            {t('msg_options_analytics_label')}
          </span>
        </label>
      </div>
    )
  }
}
