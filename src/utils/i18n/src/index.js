import {getI18nMessage} from 'utils/platform'

export function t () {
  const args = Array.prototype.map.call(arguments, String)
  return getI18nMessage(args[0], args.slice(1))
}

export function dir (locale) {
  const main = locale.split('-')[0]
  return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(main) !== -1 ? 'rtl' : 'ltr'
}
