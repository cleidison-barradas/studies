import Palette from './Palette'
import PaletteBorder from './PaletteBorder'
import PaletteSpacing from './PaletteSpacing'
import PaletteText from './PaletteText'

export default interface Theme {
  color: Palette
  border: PaletteBorder
  text: PaletteText
  spacing: PaletteSpacing
}
