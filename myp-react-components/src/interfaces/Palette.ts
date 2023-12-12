import PaletteColor from './PaletteColor'

export default interface Palette {
  primary: PaletteColor
  secondary: PaletteColor
  feedback: {
    error: PaletteColor
    focus: PaletteColor
    approve: PaletteColor
  }
  suportColor: {
    promotional: string
    freeShipping: string
    discount: string
  }
  neutral: PaletteColor
}
