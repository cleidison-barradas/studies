import { colors } from './colors'
import { format } from 'date-fns'

/**
 * Pretty logging console
 *
 * @param {String} text
 * @param {Color} color
 */
export const logger = (text: string, color = colors.Reset): void => {
  const datetime = format(new Date(), 'HH:mm:ss')
  console.log(`${color}[${datetime}] ${text}${colors.Reset}`)
}
