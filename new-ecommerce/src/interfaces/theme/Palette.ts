import PaletteColor from './PaletteColor'

export default interface Palette {
  primary: PaletteColor
  secondary: PaletteColor
  cta: string
  footerTextColor: string
  headerTextColor: string
  feedback: {
    error: PaletteColor
    focus: PaletteColor
    approve: PaletteColor
  }
  suportColor: {
    promotional: string
    freeShipping: string
    discount: string
    laboratoryColor: string
    laboratoryBackground: string
  }
  neutral: PaletteColor
}
