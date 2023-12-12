import Theme from '../interfaces/theme/Theme'
import Color from 'color'
import PaletteColor from '../interfaces/theme/PaletteColor'

export interface MakePallete {
  primary: string
  secondary: string
  feedback?: {
    error?: string
    approve?: string
    focus?: string
  }
  neutral?: string
  cta: string
  footerTextColor: string
  headerTextColor: string
}

export function makePalette({
  primary,
  secondary,
  feedback = {},
  neutral = '#ADB5BD',
  cta,
  footerTextColor,
  headerTextColor,
}: MakePallete): Theme {
  const { error = '#F03E3E', approve = '#51CF66', focus = '#5C7CFA' } = feedback
  const theme: Theme = {
    color: {
      primary: MakePaletteColor(primary),
      secondary: MakePaletteColor(secondary),
      cta,
      footerTextColor,
      headerTextColor,
      feedback: {
        approve: MakePaletteColor(approve),
        error: MakePaletteColor(error),
        focus: MakePaletteColor(focus),
      },
      suportColor: {
        promotional: '#FB0234',
        freeShipping: '#845EF7',
        discount: '#F741B6',
        laboratoryColor: '#8A0000',
        laboratoryBackground: '#FFA4A4'
      },
      neutral: MakePaletteColor(neutral),
    },
    border: {
      radius: {
        lg: '24px',
        md: '16px',
        sm: '8px',
        none: '0px',
        pill: '500px',
      },
      width: {
        hairline: '1px',
        thin: '2px',
        thick: '4px',
        heavy: '8px',
        none: '0px',
      },
    },
    spacing: {
      inset: {
        xxs: '4px',
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '40px',
      },
      squish: {
        xs: '4px 8px',
        sm: '8px 16px',
        md: '16px 24px',
        lg: '24px 32px',
        xl: '32px 40px',
      },
      inline: {
        quarck: '4px',
        nano: '8px',
        xxxs: '16px',
        xxs: '24px',
        xs: '32px',
        sm: '40px',
        md: '48px',
        lg: '56px',
        xl: '64px',
        xxl: '80px',
      },
      stack: {
        quarck: '4px',
        nano: '8px',
        xxxs: '16px',
        xxs: '24px',
        xs: '32px',
        sm: '40px',
        md: '48px',
        lg: '56px',
        xl: '64px',
        xxl: '80px',
        xxxl: '120px',
        huge: '160px',
        giant: '192px',
      },
    },
    text: {
      fontFamily: {
        primary: 'Poppins,sans-serif',
        secondary: 'Montserrat,sans-serif',
      },
      fontWeight: {
        bold: 700,
        semibold: 600,
        medium: 500,
        regular: 400,
      },
      fontsize: {
        xxs: '14px',
        xs: '16px',
        md: '18px',
        lg: '20px',
        xl: '24px',
        xxl: '28px',
        xxxl: '32px',
        giant: '48px',
      },
      lineHeight: {
        close: '120%',
        tight: '124%',
        medium: '144%',
        distant: '148%',
      },
    },
  }

  return theme
}

export function MakePaletteColor(color: string): PaletteColor {
  const parsedColor = Color(color)
  return {
    darkest: parsedColor.darken(0.6).hex().toString(),
    dark: parsedColor.darken(0.3).hex().toString(),
    medium: parsedColor.hex().toString(),
    light: parsedColor.lighten(0.2).hex().toString(),
    lightest: parsedColor.lighten(0.4).hex().toString(),
  }
}
