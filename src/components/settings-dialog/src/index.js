import React, {Component, PropTypes} from 'react'
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Slider} from 'react-mdl'
import {autobind} from 'core-decorators'
import dialogPolyfill from 'dialog-polyfill'
import {t} from 'utils/i18n'
import {minNetsize, maxNetsize, defaultNetsize, defaultSamplefac} from 'utils/settings'

import _styles from './index.scss'

export default class SettingsDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    url: PropTypes.string.isRequired,
    samplefac: PropTypes.number,
    netsize: PropTypes.number,
    onChangeNetsize: PropTypes.func
  }

  state = {}

  @autobind
  handleDialogRef (dialog) {
    this._dialog = dialog
  }

  @autobind
  handleChangeNetsize (evt) {
    const {onChangeNetsize} = this.props
    onChangeNetsize && onChangeNetsize(parseInt(evt.target.value, 10))
  }

  hasDialog () {
    const dialog = this._dialog && this._dialog.refs.dialog
    return (dialog instanceof Node) && document.contains(dialog)
  }

  componentDidMount () {
    dialogPolyfill.registerDialog(this._dialog.refs.dialog)
  }

  render () {
    const {open, url, samplefac: propsSamplefac, netsize: propsNetsize} = this.props
    const {samplefac: stateSamplefac, netsize: stateNetsize} = this.state
    const currentSamplefac = stateSamplefac || propsSamplefac || defaultSamplefac
    const currentNetsize = stateNetsize || propsNetsize || defaultNetsize
    const isOpen = this.hasDialog() && !!open

    return (
      <Dialog className='app-settings-dialog' open={isOpen}
        ref={this.handleDialogRef}
      >
        <form method='get'>
          <DialogTitle>
            {t('msg_settings_dialog_title', currentNetsize)}
          </DialogTitle>
          <DialogContent>
            <input type='hidden' name='url' value={btoa(url)} />
            <input type='hidden' name='samplefac' value={currentSamplefac} />
            <div className='app-settings-dialog__field'>
              <label htmlFor='app-settings-dialog-netsize'>
                {t('msg_settings_dialog_netsize_label')}:
              </label>
              <Slider id='app-settings-dialog-netsize' name='netsize'
                min={minNetsize} max={maxNetsize} value={currentNetsize}
                onChange={this.handleChangeNetsize}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button type='submit' colored raised ripple>
              {t('msg_settings_dialog_submit_button')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}
