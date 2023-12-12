import lightPalette from './lightPalette'
import darkPalette from './darkPalette'

export default (color: string, mode: string) => {
  if (mode === 'dark') {
    return darkPalette[color]
  }
  return lightPalette[color]
}
