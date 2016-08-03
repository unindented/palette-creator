import React, {Component, PropTypes} from 'react'
import {Router, Route} from 'react-router'
import Foreground from 'components/foreground'

import _styles from './index.scss'

export default class App extends Component {
  static propTypes = {
    history: PropTypes.any.isRequired
  }

  render () {
    const {history} = this.props

    return (
      <Router history={history}>
        <Route path="/foreground.html" component={Foreground} />
      </Router>
    )
  }
}
