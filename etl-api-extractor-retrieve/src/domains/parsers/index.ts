import versatil from './versatil/VersatilParser'
import pharmaus from './pharmus/PharmusParser'
import trier from './trier/TrierParser'
import toolspharma from './toolspharma/toolspharmaParser'

const allParsers = [pharmaus, versatil, trier, toolspharma]

allParsers.map(parser => {
  const { key, handle } = parser

  return {
    key,
    handle
  }
})


export default allParsers
