import {Component, PropTypes} from 'react'
import {Header, Icon, Navigation, Content, Snackbar} from 'react-mdl'
import {autobind} from 'core-decorators'
import defaults from 'lodash/defaults'
import Image from 'components/image'
import Quantizer from 'components/quantizer'
import Colors from 'components/colors'
import SettingsDialog from 'components/settings-dialog'
import AboutDialog from 'components/about-dialog'
import {t} from 'utils/i18n'
import {trackEvent, trackTiming, trackException} from 'utils/analytics'
import {defaultSettings, loadSettings, saveSettings} from 'utils/settings'
import {validateProps} from 'utils/validate'

import _styles from './index.scss'

export default class Foreground extends Component {
  static propTypes = {
    location: PropTypes.any
  }

  constructor () {
    super()

    this.state = defaultSettings()

    loadSettings(function (settings) {
      this.setState(settings)
    }.bind(this))
  }

  @autobind
  handleAboutClick () {
    trackEvent('About', 'Open')

    this.setState({about: true})
  }

  @autobind
  handleAboutDonate (url) {
    trackEvent('About', 'Donate', url)

    this.setState({about: false})
  }

  @autobind
  handleAboutClose () {
    trackEvent('About', 'Close')

    this.setState({about: false})
  }

  @autobind
  handleImageLoad (image, timing) {
    timing && trackTiming('Image', 'Load', timing)

    this.setState({image})
  }

  @autobind
  handleImageError () {
    trackException(new Error('Could not load image'), false)

    this.setState({image: new Error()})
  }

  @autobind
  handleQuantizerLoad (palette, timing) {
    timing && trackTiming('Image', 'Quantize', timing)

    this.setState({palette})
  }

  @autobind
  handleChangeFormat (format) {
    this.setState({format})
    saveSettings({format})
  }

  @autobind
  handleChangeSamplefac (samplefac) {
    this.setState({samplefac})
    saveSettings({samplefac})
  }

  @autobind
  handleChangeNetsize (netsize) {
    this.setState({netsize})
    saveSettings({netsize})
  }

  @autobind
  handleCopy () {
    trackEvent('Colors', 'Copy')

    this.setState({snackbar: t('msg_copy_button_snackbar')})
  }

  @autobind
  handleDownload () {
    trackEvent('Colors', 'Download')

    this.setState({snackbar: t('msg_download_button_snackbar')})
  }

  @autobind
  handleSnackbarTimeout () {
    this.setState({snackbar: null})
  }

  render () {
    const {location} = this.props
    const {snackbar, about, ...state} = this.state
    const {url, samplefac, netsize, custom} = location.query
    const childProps = defaults({}, {
      url: atob(url),
      samplefac: parseInt(samplefac, 10) || undefined,
      netsize: parseInt(netsize, 10) || undefined,
      custom
    }, state)

    const showSettings = !validateProps(childProps)
    const showAbout = !!about

    const title = (
      <span>
        <Icon name='palette' />
        {t('ext_name')}
      </span>
    )

    return (
      <div className='app-layout'>
        <div className='app-layout__container'>
          <Header title={title}>
            <Navigation>
              <a href='#'
                onClick={this.handleAboutClick}
              >
                {t('msg_header_about')}
              </a>
            </Navigation>
          </Header>

          <Content>
            <Image {...childProps}
              onLoad={this.handleImageLoad}
              onError={this.handleImageError}
            />
            <Quantizer {...childProps}
              onLoad={this.handleQuantizerLoad}
            />
            <Colors {...childProps}
              onChangeFormat={this.handleChangeFormat}
              onCopy={this.handleCopy}
              onDownload={this.handleDownload}
            />

            <Snackbar active={!!snackbar}
              onTimeout={this.handleSnackbarTimeout}
            >
              {snackbar}
            </Snackbar>
          </Content>
        </div>

        <SettingsDialog {...childProps}
          open={showSettings}
          onChangeSamplefac={this.handleChangeSamplefac}
          onChangeNetsize={this.handleChangeNetsize}
        />
        <AboutDialog {...childProps}
          open={showAbout}
          onDonate={this.handleAboutDonate}
          onClose={this.handleAboutClose}
        />
      </div>
    )
  }
}
