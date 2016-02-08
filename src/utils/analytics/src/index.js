import {getService} from 'cpa'
import pkg from 'package.json'

let service = null
let tracker = null

try {
  service = getService(pkg.name)
  tracker = service.getTracker(pkg.analytics.code)
} catch (e) {}

export function getConfig (callback) {
  service && service.getConfig().addCallback(callback)
}

export function isTrackingPermitted (callback) {
  getConfig((config) => {
    callback(config.isTrackingPermitted())
  })
}

export function setTrackingPermitted (permitted) {
  getConfig((config) => {
    config.setTrackingPermitted(permitted)
  })
}

export function trackView (view) {
  tracker && tracker.sendAppView(view || window.location.pathname)
}

export function trackEvent (category, action, label, value) {
  tracker && tracker.sendEvent(category, action, label, value)
}

export function trackTiming (category, variable, value, label, rate) {
  tracker && tracker.sendTiming(category, variable, value, label, rate)
}

export function trackException (err, fatal) {
  tracker && tracker.sendException(err.message, fatal)
}
