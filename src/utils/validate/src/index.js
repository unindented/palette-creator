import {minSamplefac, maxSamplefac, minNetsize, maxNetsize, formats} from 'utils/settings'

export function validateProps (props) {
  const {samplefac, netsize, format, custom} = props
  return (
    samplefac >= minSamplefac && samplefac <= maxSamplefac &&
    netsize >= minNetsize && netsize <= maxNetsize &&
    formats.indexOf(format) >= 0 &&
    !custom
  )
}
