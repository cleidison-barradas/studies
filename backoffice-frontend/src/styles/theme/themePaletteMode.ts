import lightPalette from './lightPalette'
import darkPalette from './darkPalette'

const themePallete = (color: string, mode: 'dark' | 'light' | undefined) => {
  if (mode === 'dark') {
    return darkPalette[color]
  }
  return lightPalette[color]
}

export default themePallete
